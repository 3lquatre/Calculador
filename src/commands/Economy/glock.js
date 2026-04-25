import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';
import { withErrorHandling, createError, ErrorTypes } from '../../utils/errorHandler.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

const GLOCK_PRICE = 5500;
const MAX_QUANTITY = 100;

export default {
    data: new SlashCommandBuilder()
        .setName('glock')
        .setDescription('Calculate the total price for a quantity of glocks')
        .addIntegerOption(option =>
            option
                .setName('quantity')
                .setDescription('Number of glocks to price (1–100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(MAX_QUANTITY)
        ),

    execute: withErrorHandling(async (interaction, config, client) => {
        const deferred = await InteractionHelper.safeDefer(interaction);
        if (!deferred) return;

        const quantity = interaction.options.getInteger('quantity');

        if (!quantity || quantity < 1) {
            throw createError(
                'Invalid glock quantity provided',
                ErrorTypes.VALIDATION,
                'Please provide a valid quantity between **1** and **100**.',
                { quantity }
            );
        }

        if (quantity > MAX_QUANTITY) {
            throw createError(
                'Glock quantity exceeds maximum',
                ErrorTypes.VALIDATION,
                `The maximum quantity is **${MAX_QUANTITY}** glocks per calculation.`,
                { quantity, max: MAX_QUANTITY }
            );
        }

        const totalPrice = quantity * GLOCK_PRICE;

        const embed = createEmbed({
            title: '🔫 Glock Price Calculator',
            description: `Here is the total cost for your glock order.`,
            color: 'primary',
        })
            .addFields(
                {
                    name: '🔢 Quantity',
                    value: `${quantity.toLocaleString()} kit${quantity !== 1 ? 's' : ''}`,
                    inline: true,
                },
                {
                    name: '💲 Unit Price',
                    value: `$${GLOCK_PRICE.toLocaleString()}`,
                    inline: true,
                },
                {
                    name: '💰 Total Price',
                    value: `$${totalPrice.toLocaleString()}`,
                    inline: true,
                }
            )
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL(),
            });

        await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
    }, { command: 'glock' })
};
