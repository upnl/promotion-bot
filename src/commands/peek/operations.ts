import {
  ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
  InteractionResponse,
  Message,
  User,
  UserSelectMenuInteraction,
} from "discord.js";
import {
  getMissionAll,
  getMissionCount,
} from "../../db/actions/missionActions.js";
import {
  getMissionProgress,
  getMissionProgressAll,
} from "../../db/actions/missionProgressActions.js";
import { checkRegular } from "../utils/checks/checkRegular.js";
import { createMissionMapString } from "../utils/createString/createMissionString.js";
import { createProgressString } from "../utils/createString/createProgresString.js";
import { errorEmbed } from "../utils/errorEmbeds.js";
import { getQuarterDataFooter } from "../utils/quarterData/getQuarterData.js";
import builders from "./builders.js";
import { checkAssociate } from "../utils/checks/checkAssociate.js";
import { getAllAssociateIds } from "../../db/actions/memberActions.js";
import assert from "assert";

const {
  noUserEmbed,
  noAssociateEmbed,
  viewListEmbedPrototype,
  REGULAR_MENU_ID,
  ASSOCITE_MENU_ID,
  actionRow1,
  actionRow2,
} = builders;

export const readOptions = (interaction: ChatInputCommandInteraction) => ({
  giver: interaction.options.getUser("정회원"),
  target: interaction.options.getUser("준회원"),
});

const doMenu = async (
  interaction: ChatInputCommandInteraction,
  menuInteraction: UserSelectMenuInteraction,
  oldGiver: User | null,
  oldTarget: User | null
) => {
  if (menuInteraction.customId === REGULAR_MENU_ID) {
    await menuInteraction.deferUpdate();

    const newGiver = interaction.client.users.cache.get(
      menuInteraction.values[0]
    )!;

    await doReply(interaction, newGiver, oldTarget, true);
  } else if (menuInteraction.customId === ASSOCITE_MENU_ID) {
    await menuInteraction.deferUpdate();

    const newTarget = interaction.client.users.cache.get(
      menuInteraction.values[0]
    )!;

    await doReply(interaction, oldGiver, newTarget, true);
  }
};

const addCollector = (
  interaction: ChatInputCommandInteraction,
  reply: Message<boolean> | InteractionResponse<boolean>,
  oldGiver: User | null,
  oldTarget: User | null
) => {
  const collector = reply.createMessageComponentCollector({
    max: 10,
    filter: (i) => i.user === interaction.user,
    componentType: ComponentType.UserSelect,
  });
  collector.on("collect", (buttonInteraction) =>
    doMenu(interaction, buttonInteraction, oldGiver, oldTarget)
  );
};

export const doReply = async (
  interaction: ChatInputCommandInteraction,
  giver: User | null,
  target: User | null,
  isEditing: boolean = false
) => {
  if (!isEditing) await interaction.deferReply({ ephemeral: true });

  if (!giver && !target) {
    const reply = await interaction.editReply({
      embeds: [noUserEmbed.setFooter(await getQuarterDataFooter())],
      components: [actionRow1, actionRow2],
    });
    if (!isEditing) addCollector(interaction, reply, giver, target);
    return;
  } else if (!giver && target) {
    if (
      !(await checkAssociate(interaction, target.id, false, [
        actionRow1,
        actionRow2,
      ]))
    ) {
      if (!isEditing)
        addCollector(
          interaction,
          await interaction.fetchReply(),
          giver,
          target
        );
      return;
    }
    const progresses = await getMissionProgressAll(
      interaction.client,
      target.id
    );
    if (progresses === undefined) {
      await interaction.editReply({ embeds: [errorEmbed] });
      return;
    }

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${target.displayName}의 승격조건 : 현황`)
          .addFields(
            progresses.map((progress) => ({
              name:
                (progress.currentScore >= progress.goalScore
                  ? ":white_check_mark:"
                  : ":white_square_button:") +
                " " +
                progress.giverName,
              value: `달성 현황: ${createProgressString(
                progress.currentScore,
                progress.goalScore
              )}`,
              inline: false,
            }))
          )
          .setFooter(await getQuarterDataFooter()),
      ],
    });
  } else if (giver && !target) {
    if (
      !(await checkRegular(interaction, giver.id, [actionRow1, actionRow2]))
    ) {
      if (!isEditing)
        addCollector(
          interaction,
          await interaction.fetchReply(),
          giver,
          target
        );
      return;
    }

    const associateIds = await getAllAssociateIds();
    if (associateIds === undefined) {
      await interaction.editReply({ embeds: [noAssociateEmbed] });
      return;
    }

    const universalCount = await getMissionCount(giver.id, giver.id);

    const datas = await Promise.all(
      associateIds.map(async (associateId) => {
        const progress = await getMissionProgress(giver.id, associateId);
        assert(progress !== undefined);
        return {
          targetName: await interaction.client.users
            .fetch(associateId)
            .then((user) => user.displayName),
          status: {
            universalCount,
            specificCount: await getMissionCount(giver.id, associateId),
          },
          progress,
        };
      })
    );

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${giver.displayName}이 제시한 승격조건 : 현황`)
          .addFields(
            datas.map((data) => ({
              name:
                (data.progress.currentScore >= data.progress.goalScore
                  ? ":white_check_mark:"
                  : ":white_square_button:") +
                " " +
                data.targetName,
              value:
                `제시 현황: 공통조건 ${data.status.universalCount}개 / 개인조건 ${data.status.specificCount}개\n` +
                `달성 현황: ${createProgressString(
                  data.progress.currentScore,
                  data.progress.goalScore
                )}`,
              inline: false,
            }))
          )
          .setFooter(await getQuarterDataFooter()),
      ],
    });
  } else if (giver && target) {
    if (
      !(await checkRegular(interaction, giver.id, [actionRow1, actionRow2]))
    ) {
      if (!isEditing)
        addCollector(
          interaction,
          await interaction.fetchReply(),
          giver,
          target
        );
      return;
    }
    
    let replyEmbed: EmbedBuilder;
    if (target.id === interaction.user.id) {
      const missionUniversal = await getMissionAll(
        interaction.user.id,
        interaction.user.id
      );
      if (missionUniversal === undefined) {
        await interaction.editReply({ embeds: [errorEmbed] });
        return;
      }

      replyEmbed = new EmbedBuilder(viewListEmbedPrototype.toJSON())
        .setTitle(`공통 승격 조건: ${interaction.user.displayName}`)
        .addFields({
          name: "공통 조건",
          value: createMissionMapString(missionUniversal, interaction.user.id),
          inline: false,
        });
    } else {
      if (
        !(await checkAssociate(interaction, target.id, true, [
          actionRow1,
          actionRow2,
        ]))
      ) {
        if (!isEditing)
          addCollector(
            interaction,
            await interaction.fetchReply(),
            giver,
            target
          );
        return;
      }

      const progress = await getMissionProgress(interaction.user.id, target.id);
      const missionUniversal = await getMissionAll(
        interaction.user.id,
        interaction.user.id
      );
      const missionSpecific = await getMissionAll(
        interaction.user.id,
        target.id
      );
      if (
        missionUniversal === undefined ||
        missionSpecific === undefined ||
        progress === undefined
      ) {
        await interaction.editReply({ embeds: [errorEmbed] });
        return;
      }

      replyEmbed = new EmbedBuilder(viewListEmbedPrototype.toJSON())
        .setTitle(
          `${target.displayName}의 승격 조건 : ${interaction.user.displayName}`
        )
        .addFields({
          name: "달성 현황",
          value: createProgressString(
            progress.currentScore,
            progress.goalScore
          ),
          inline: false,
        })
        .addFields({
          name: "공통 조건",
          value: createMissionMapString(missionUniversal, target.id),
          inline: false,
        })
        .addFields({
          name: "개인 조건",
          value: createMissionMapString(missionSpecific, target.id),
          inline: false,
        });
    }

    const reply = await interaction.editReply({
      embeds: [replyEmbed.setFooter(await getQuarterDataFooter())],
      components: [actionRow1, actionRow2],
    });
    if (!isEditing) addCollector(interaction, reply, giver, target);
  }
};
