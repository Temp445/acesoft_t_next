import { generateWhatsAppPayload } from "./templates/payloadGenerator";
import { getTemplateRegistry } from './templates/templateRgistry';

export async function sendWhatsappMessage<T>(
    templateId: string,
    templateData: T,
    phoneNumbers: string[]
): Promise<void> {

    if (!templateId || !templateData || !Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
        console.error("Invalid parameters for sending WhatsApp message.");
        return;
    }

    const stromxToken = process.env.NEXT_PUBLIC_STROMX_TOKEN;
    if (!stromxToken) {
        console.warn("Stromx token is not set. Cannot send WhatsApp message.");
        return;
    }

    const registry = getTemplateRegistry();
    const meta = registry[templateId];

    if (meta && meta.schema) {
        const result = meta.schema.safeParse(templateData);
        if (!result.success) {
            console.error(`Validation failed for template ${templateId}`, result.error);
            return;
        }
    }
    else {
        console.error(`Template ${templateId} not found in registry.`);
        return;
    }

    // Generate the WhatsApp message payload
    const messagePayload = generateWhatsAppPayload(meta, templateData);

    for (const phone of phoneNumbers) {
        try {
            const response = await fetch(
                `https://api.stromx.io/v1/message/send-message?token=${stromxToken}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...messagePayload, to: phone })
                }
            );
            const data = await response.json();

            if (response.ok) {
                console.log(`WhatsApp sent to ${phone}:`, data);
            } else {
                console.error(`WhatsApp failed for ${phone}:`, data);
            }
        } catch (error) {
            console.error(`WhatsApp error for ${phone}:`, error);
        }
    }

    // Proceed to send the message using templateId and validated data
    console.log(`Sending WhatsApp message using template: ${templateId}`);
    console.log("Data:", templateData);
}
