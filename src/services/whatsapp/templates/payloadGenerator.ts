import { TemplateMeta, ComponentType } from "./templateRgistry";

type Parameter =
    | { type: 'text'; text: string }
    | { type: 'date_time'; date_time: { fallback_value: string } }
    | { type: 'image'; image: { link: string } };

type Component = {
    type: ComponentType;
    parameters: Parameter[];
};

type WhatsAppPayload = {
    type: 'template';
    template: {
        name: string;
        language: { policy: 'deterministic'; code: string };
        components: Component[];
    };
};

export function generateWhatsAppPayload<T extends object>(
    meta: TemplateMeta<T>,
    data: T,
    languageCode = 'en'
): WhatsAppPayload {
    const result = meta.schema.safeParse(data);
    if (!result.success) {
        throw new Error(
            `Invalid template data: ${JSON.stringify(result.error.format(), null, 2)}`
        );
    }

    const componentMap = new Map<string, Parameter[]>();

    for (const { key, type, component } of meta.componentsMap) {
        const value = (data as any)[key]; 

        let param: Parameter;

        if (value === undefined || value === null) {
            param = { type: 'text', text: '[Missing]' };
        } else if (type === 'text') {
            param = { type: 'text', text: String(value) };
        } else if (type === 'date_time' && value instanceof Date) {
            param = {
                type: 'date_time',
                date_time: {
                    fallback_value: value.toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    }),
                },
            };
        } else if (type === 'image' && typeof value === 'string') {
            param = {
                type: 'image',
                image: { link: value },
            };
        } else {
            // Fallback for unsupported or incorrect types
            param = { type: 'text', text: String(value) };
        }

        if (!componentMap.has(component)) {
            componentMap.set(component, []);
        }

        componentMap.get(component)!.push(param);
    }

    const components: Component[] = Array.from(componentMap.entries()).map(
        ([type, parameters]) => ({ type: type as ComponentType, parameters })
    );

    return {
        type: 'template',
        template: {
            name: meta.templateId,
            language: {
                policy: 'deterministic',
                code: languageCode,
            },
            components,
        },
    };
}
