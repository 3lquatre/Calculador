import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';
import { withErrorHandling } from '../../utils/errorHandler.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

export default {
    data: new SlashCommandBuilder()
        .setName('encomendas')
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
        )
        .addBooleanOption(option =>
            option
                .setName('tactical_suppressor')
                .setDescription('Include tactical suppressor for guns?')
                .setRequired(false)
        )
        .addBooleanOption(option =>
            option
                .setName('ext_clip')
                .setDescription('Include extended clip for guns?')
                .setRequired(false)
        )
        .addBooleanOption(option =>
            option
                .setName('grip')
                .setDescription('Include grip for guns?')
                .setRequired(false)
        )
        .addBooleanOption(option =>
            option
                .setName('barrel')
                .setDescription('Include barrel for guns?')
                .setRequired(false)
        )
        .addBooleanOption(option =>
            option
                .setName('lantern')
                .setDescription('Include lantern for guns?')
                .setRequired(false)
        )
        .addBooleanOption(option =>
            option
                .setName('scope')
                .setDescription('Include scope for guns?')
                .setRequired(false)
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
        const hasTacticalSuppressor = interaction.options.getBoolean('tactical_suppressor') || false;
        const hasExtClip = interaction.options.getBoolean('ext_clip') || false;
        const hasGrip = interaction.options.getBoolean('grip') || false;
        const hasBarrel = interaction.options.getBoolean('barrel') || false;
        const hasLantern = interaction.options.getBoolean('lantern') || false;
        const hasScope = interaction.options.getBoolean('scope') || false;

        // Base prices with material
        const baseWithMaterial = {
            smgmk2: 0, // Add base price
            p90: 0, // Add base price
            uzi: 0, // Add base price
            ak47mk2: 0, // Add base price
            g36: 0 // Add base price
        };

        // Base prices without material
        const baseWithoutMaterial = {
            smgmk2: 0, // Add base price
            p90: 0, // Add base price
            uzi: 0, // Add base price
            ak47mk2: 0, // Add base price
            g36: 0 // Add base price
        };

        // Accessory prices with material
        const accessoriesWithMaterial = {
            tactical_suppressor: 4500,
            ext_clip: 5000,
            grip: 5500,
            barrel: 4250,
            lantern: 2750,
            scope: 3750
        };

        // Accessory prices without material
        const accessoriesWithoutMaterial = {
            tactical_suppressor: 6500,
            ext_clip: 6500,
            grip: 7500,
            barrel: 5500,
            lantern: 4000,
            scope: 3500
        };

        const basePrices = hasMaterial ? baseWithMaterial : baseWithoutMaterial;
        const accessoryPrices = hasMaterial ? accessoriesWithMaterial : accessoriesWithoutMaterial;

        let accessoryTotal = 0;
        const accessories = [];

        if (hasTacticalSuppressor) {
            accessoryTotal += accessoryPrices.tactical_suppressor;
            accessories.push(`✓ Tactical Suppressor: $${accessoryPrices.tactical_suppressor.toLocaleString()}`);
        }
        if (hasExtClip) {
            accessoryTotal += accessoryPrices.ext_clip;
            accessories.push(`✓ Ext. Clip: $${accessoryPrices.ext_clip.toLocaleString()}`);
        }
        if (hasGrip) {
            accessoryTotal += accessoryPrices.grip;
            accessories.push(`✓ Grip: $${accessoryPrices.grip.toLocaleString()}`);
        }
        if (hasBarrel) {
            accessoryTotal += accessoryPrices.barrel;
            accessories.push(`✓ Barrel: $${accessoryPrices.barrel.toLocaleString()}`);
        }
        if (hasLantern) {
            accessoryTotal += accessoryPrices.lantern;
            accessories.push(`✓ Lantern: $${accessoryPrices.lantern.toLocaleString()}`);
        }
        if (hasScope) {
            accessoryTotal += accessoryPrices.scope;
            accessories.push(`✓ Scope: $${accessoryPrices.scope.toLocaleString()}`);
        }

        const items = [];
        let grandTotal = 0;

        if (smgmk2Qty > 0) {
            const kitPrice = basePrices.smgmk2 + accessoryTotal;
            const total = smgmk2Qty * kitPrice;
            items.push(`SMG MK2: ${smgmk2Qty} x $${kitPrice.toLocaleString()} = $${total.toLocaleString()}`);
            grandTotal += total;
        }
        if (p90Qty > 0) {
            const kitPrice = basePrices.p90 + accessoryTotal;
            const total = p90Qty * kitPrice;
            items.push(`P90: ${p90Qty} x $${kitPrice.toLocaleString()} = $${total.toLocaleString()}`);
            grandTotal += total;
        }
        if (uziQty > 0) {
            const kitPrice = basePrices.uzi + accessoryTotal;
            const total = uziQty * kitPrice;
            items.push(`UZI: ${uziQty} x $${kitPrice.toLocaleString()} = $${total.toLocaleString()}`);
            grandTotal += total;
        }
        if (ak47mk2Qty > 0) {
            const kitPrice = basePrices.ak47mk2 + accessoryTotal;
            const total = ak47mk2Qty * kitPrice;
            items.push(`AK47 MK2: ${ak47mk2Qty} x $${kitPrice.toLocaleString()} = $${total.toLocaleString()}`);
            grandTotal += total;
        }
        if (g36Qty > 0) {
            const kitPrice = basePrices.g36 + accessoryTotal;
            const total = g36Qty * kitPrice;
            items.push(`G36: ${g36Qty} x $${kitPrice.toLocaleString()} = $${total.toLocaleString()}`);
            grandTotal += total;
        }
        if (coletesQty > 0) {
            const price = hasMaterial ? 6000 : 17500;
            const total = coletesQty * price;
            items.push(`Coletes: ${coletesQty} x $${price.toLocaleString()} = $${total.toLocaleString()}`);
            grandTotal += total;
        }
        if (bonocosQty > 0) {
            const price = hasMaterial ? 500 : 700;
            const total = bonocosQty * price;
            items.push(`Bonecos: ${bonocosQty} x $${price.toLocaleString()} = $${total.toLocaleString()}`);
            grandTotal += total;
        }
        if (drumrifleQty > 0) {
            const price = hasMaterial ? 7000 : 8000;
            const total = drumrifleQty * price;
            items.push(`Drum Rifle: ${drumrifleQty} x $${price.toLocaleString()} = $${total.toLocaleString()}`);
            grandTotal += total;
        }

        const embed = createEmbed({
            title: '📦 Encomenda Total',
            color: 'primary',
        })
            .addFields(
                { name: 'Items', value: items.length > 0 ? items.join('\n') : 'Nenhum item', inline: false },
                { name: 'Accessories', value: accessories.length > 0 ? accessories.join('\n') : 'Nenhum acessório', inline: false },
                { name: 'Material', value: hasMaterial ? '✓ Yes' : '✗ No', inline: true },
                { name: 'Grand Total', value: `$${grandTotal.toLocaleString()}`, inline: true }
            );

        const message = await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });

        // Delete message after 30 minutes (1800000 milliseconds)
        setTimeout(() => {
            message?.delete().catch(() => {});
        }, 1800000);
    }, { command: 'encomendas' })
};
