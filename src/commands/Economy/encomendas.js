import { SlashCommandBuilder, PermissionsBitField, MessageFlags, ChannelType } from 'discord.js';
import { createEmbed, errorEmbed } from '../../utils/embeds.js';
import { withErrorHandling, createError, ErrorTypes } from '../../utils/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

// Channel names used for each encomenda stage (must match exactly in the server)
const CHANNEL_NOVA     = 'encomendas-novas';
const CHANNEL_PROCESSO = 'em-processo';
const CHANNEL_FEITA    = 'feitas';

/**
 * Resolves a text channel by name (case-insensitive) within the guild.
 * Returns the channel object or null if not found.
 */
function findChannelByName(guild, name) {
    return guild.channels.cache.find(
        ch => ch.type === ChannelType.GuildText &&
              ch.name.toLowerCase() === name.toLowerCase()
    ) || null;
}

export default {
    data: new SlashCommandBuilder()
        .setName('encomenda')
        .setDescription('Gestão de encomendas nos canais de estado.')
        .addSubcommand(sub =>
            sub
                .setName('nova')
                .setDescription('Registar uma nova encomenda no canal "encomendas-novas".')
                .addStringOption(opt =>
                    opt
                        .setName('descricao')
                        .setDescription('Descrição ou nome da encomenda.')
                        .setRequired(true)
                        .setMaxLength(500)
                )
                .addUserOption(opt =>
                    opt
                        .setName('cliente')
                        .setDescription('Cliente que fez a encomenda (opcional).')
                        .setRequired(false)
                )
        )
        .addSubcommand(sub =>
            sub
                .setName('processo')
                .setDescription('Mover uma encomenda para o canal "em-processo".')
                .addStringOption(opt =>
                    opt
                        .setName('descricao')
                        .setDescription('Descrição ou nome da encomenda.')
                        .setRequired(true)
                        .setMaxLength(500)
                )
                .addUserOption(opt =>
                    opt
                        .setName('cliente')
                        .setDescription('Cliente da encomenda (opcional).')
                        .setRequired(false)
                )
        )
        .addSubcommand(sub =>
            sub
                .setName('feita')
                .setDescription('Mover uma encomenda para o canal "feitas" (pronta a entregar).')
                .addStringOption(opt =>
                    opt
                        .setName('descricao')
                        .setDescription('Descrição ou nome da encomenda.')
                        .setRequired(true)
                        .setMaxLength(500)
                )
                .addUserOption(opt =>
                    opt
                        .setName('cliente')
                        .setDescription('Cliente da encomenda (opcional).')
                        .setRequired(false)
                )
        ),

    execute: withErrorHandling(async (interaction, config, client) => {
        // Defer ephemerally so only the invoker sees the confirmation
        const deferred = await InteractionHelper.safeDefer(interaction, { flags: MessageFlags.Ephemeral });
        if (!deferred) return;

        const subcommand  = interaction.options.getSubcommand();
        const descricao   = interaction.options.getString('descricao');
        const cliente     = interaction.options.getUser('cliente');
        const guild       = interaction.guild;
        const invoker     = interaction.user;

        // ── Resolve target channel & build embed based on subcommand ──────────
        let targetChannelName;
        let embedColor;
        let statusLabel;
        let statusEmoji;

        if (subcommand === 'nova') {
            targetChannelName = CHANNEL_NOVA;
            embedColor        = 'info';   // blue
            statusLabel       = 'Nova Encomenda';
            statusEmoji       = '🆕';
        } else if (subcommand === 'processo') {
            targetChannelName = CHANNEL_PROCESSO;
            embedColor        = 'warning'; // yellow
            statusLabel       = 'Em Processo';
            statusEmoji       = '⚙️';
        } else if (subcommand === 'feita') {
            targetChannelName = CHANNEL_FEITA;
            embedColor        = 'success'; // green
            statusLabel       = 'Pronta a Entregar';
            statusEmoji       = '✅';
        } else {
            throw createError(
                'Unknown encomenda subcommand',
                ErrorTypes.VALIDATION,
                'Subcomando desconhecido. Usa /encomenda nova, processo ou feita.'
            );
        }

        // ── Find the target channel ───────────────────────────────────────────
        const targetChannel = findChannelByName(guild, targetChannelName);

        if (!targetChannel) {
            logger.warn(`[ENCOMENDAS] Canal "${targetChannelName}" não encontrado no servidor ${guild.id}`);
            throw createError(
                `Channel "${targetChannelName}" not found`,
                ErrorTypes.CONFIGURATION,
                `Não encontrei o canal **#${targetChannelName}** neste servidor. Certifica-te de que o canal existe com esse nome exacto.`
            );
        }

        // ── Check bot permissions in the target channel ───────────────────────
        const botMember = guild.members.me;
        if (!targetChannel.permissionsFor(botMember).has(PermissionsBitField.Flags.SendMessages)) {
            throw createError(
                `Missing SendMessages permission in #${targetChannelName}`,
                ErrorTypes.PERMISSION,
                `Não tenho permissão para enviar mensagens em ${targetChannel}. Verifica as permissões do bot.`
            );
        }

        // ── Build the announcement embed ──────────────────────────────────────
        const clienteText = cliente ? `${cliente} (${cliente.tag})` : '_Não especificado_';

        const announcementEmbed = createEmbed({
            title: `${statusEmoji} ${statusLabel}`,
            description: descricao,
            color: embedColor,
            timestamp: true,
        })
            .addFields(
                {
                    name: '📦 Encomenda',
                    value: descricao,
                    inline: false,
                },
                {
                    name: '👤 Cliente',
                    value: clienteText,
                    inline: true,
                },
                {
                    name: '🛠️ Registado por',
                    value: `${invoker} (${invoker.tag})`,
                    inline: true,
                }
            )
            .setFooter({
                text: `Encomendas • ${guild.name}`,
                iconURL: guild.iconURL() ?? undefined,
            });

        // ── Post to the target channel ────────────────────────────────────────
        await targetChannel.send({ embeds: [announcementEmbed] });

        logger.info(`[ENCOMENDAS] Encomenda publicada em #${targetChannelName}`, {
            guildId: guild.id,
            userId: invoker.id,
            subcommand,
            targetChannelId: targetChannel.id,
        });

        // ── Confirm to the invoker (ephemeral) ────────────────────────────────
        const confirmEmbed = createEmbed({
            title: '✅ Encomenda registada!',
            description: `A encomenda foi publicada em ${targetChannel}.`,
            color: embedColor,
            timestamp: true,
        }).addFields({
            name: '📋 Detalhes',
            value: descricao,
            inline: false,
        });

        await InteractionHelper.safeEditReply(interaction, { embeds: [confirmEmbed] });
    }, { command: 'encomenda' }),
};
