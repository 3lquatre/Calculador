import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';
import { withErrorHandling } from '../../utils/errorHandler.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

export default {
    data: new SlashCommandBuilder()
        .setName('encomenda')
        .setDescription('Calculate bulk order prices')
        .addIntegerOption(option =>
            option
                .setName('smgmk2')
                .setDescription('SMG MK2 kits')
                .setRequired(false)
                .setMinValue(0)
        )
        .addIntegerOption(option =>
            option
                .setName('p90')
                .setDescription('P90 kits')
                .setRequired(false)
                .setMinValue(0)
        )
        .addIntegerOption(option =>
            option
                .setName('uzi')
                .setDescription('UZI kits')
                .setRequired(false)
                .setMinValue(0)
        )
        .addIntegerOption(option =>
            option
                .setName('ak47mk2')
                .setDescription('AK47 MK2 kits')
                .setRequired(false)
                .setMinValue(0)
        )
        .addIntegerOption(option =>
            option
                .setName('g36')
                .setDescription('G36 kits')
                .setRequired(false)
                .setMinValue(0)
        )
        .addIntegerOption(option =>
            option
                .setName('coletes')
                .setDescription('Coletes')
                .setRequired(false)
                .setMinValue(0)
        )
        .addIntegerOption(option =>
            option
                .setName('bonecos')
                .setDescription('Bonecos')
                .setRequired(false)
                .setMinValue(0)
        )
        .addIntegerOption(option =>
            option
                .setName('drumrifle')
                .setDescription('Drum Rifles')
                .setRequired(false)
                .setMinValue(0)
        )
        .addBooleanOption(option =>
            option
                .setName('material')
                .setDescription('Include material for all items?')
                .setRequired(true)
        ),

    execute: withErrorHandling(async (interaction, config, client) => {
        const deferred = await InteractionHelper.safeDefer(interaction);
        if (!deferred) return;

        const smgmk2Qty = interaction.options.getInteger('smgmk2') || 0;
        const p90Qty = interaction.options.getInteger('p90') || 0;
        const uziQty = interaction.options.getInteger('uzi') || 0;
        const ak47mk2Qty = interaction.options.getInteger('ak47mk2') || 0;
        const g36Qty = interaction.options.getInteger('g36') || 0;
        const coletesQty = interaction.options.getInteger('coletes') || 0;
        const bonocosQty = interaction.options.getInteger('bonecos') || 0;
        const drumrifleQty = interaction.options.getInteger('drumrifle') || 0;
        const hasMaterial = interaction.options.getBoolean('material');

        // Prices with material
        const pricesWithMaterial = {
            smgmk2: 0, // Add base price
            p90: 0, // Add base price
            uzi: 0, // Add base price
            ak47mk2: 0, // Add base price
            g36: 0, // Add base price
            coletes: 6000,
            bonecos: 500,
            drumrifle: 7000
        };

        // Prices without material
        const pricesWithoutMaterial = {
            smgmk2: 0, // Add base price
            p90: 0, // Add base price
            uzi: 0, // Add base price
            ak47mk2: 0, // Add base price
            g36: 0, // Add base price
            coletes: 17500,
            bonecos: 700,
            drumrifle: 8000
        };

        const prices = hasMaterial ? pricesWithMaterial : pricesWithoutMaterial;

        const items = [];
        let grandTotal = 0;

        if (smgmk2Qty > 0) {
            const total = smgmk2Qty * prices.smgmk2;
            items.push(`SMG MK2: ${smgmk2Qty} x $${prices.smgmk2.toLocaleString()} = $${total.toLocaleString()}`);
            grandTotal += total;
        }
        if (p90Qty > 0) {
            const total = p90Qty * prices.p90;
            items.push(`P90: ${p90Qty} x $${prices.p90.toLocaleString()} = $${total.toLocaleString()}`);
            grandTotal += total;
        }
        if (uziQty > 0) {
            const total = uziQty * prices.uzi;
            items.push(`UZI: ${uziQty} x $${prices.uzi.toLocaleString()} = $${total.toLocaleString()}`);
            grandTotal += total;
        }
        if (ak47mk2Qty > 0) {
            const total = ak47mk2Qty * prices.ak47mk2;
            items.push(`AK47 MK2: ${ak47mk2Qty} x $${prices.ak47mk2.toLocaleString()} = $${total.toLocaleString()}`);
            grandTotal += total;
        }
        if (g36Qty > 0) {
            const total = g36Qty * prices.g36;
            items.push(`G36: ${g36Qty} x $${prices.g36.toLocaleString()} = $${total.toLocaleString()}`);
            grandTotal += total;
        }
        if (coletesQty > 0) {
            const total = coletesQty * prices.coletes;
            items.push(`Coletes: ${coletesQty} x $${prices.coletes.toLocaleString()} = $${total.toLocaleString()}`);
            grandTotal += total;
        }
        if (bonocosQty > 0) {
            const total = bonocosQty * prices.bonecos;
            items.push(`Bonecos: ${bonocosQty} x $${prices.bonecos.toLocaleString()} = $${total.toLocaleString()}`);
            grandTotal += total;
        }
        if (drumrifleQty > 0) {
            const total = drumrifleQty * prices.drumrifle;
            items.push(`Drum Rifle: ${drumrifleQty} x $${prices.drumrifle.toLocaleString()} = $${total.toLocaleString()}`);
            grandTotal += total;
        }

        const embed = createEmbed({
            title: '📦 Encomenda Total',
            color: 'primary',
        })
            .addFields(
                { name: 'Items', value: items.length > 0 ? items.join('\n') : 'Nenhum item', inline: false },
                { name: 'Material', value: hasMaterial ? '✓ Yes' : '✗ No', inline: true },
                { name: 'Grand Total', value: `$${grandTotal.toLocaleString()}`, inline: true }
            );
