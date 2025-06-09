import { ZodSchema } from 'zod';
import { templateMeta as enquiryTemplateMeta } from './enquiry.template';
import { templateMeta as enquiryGreetingsTemplate } from './enquiry_greetings.template';

export type ComponentType = 'body' | 'header';

type ComponentParam = {
  key: keyof any;
  type: 'text' | 'date_time' | 'image';
  component: ComponentType;
};

export type TemplateMeta<T extends object> = {
  templateId: string;
  name: string;
  description?: string;
  language?: string;
  placeholders: (keyof T)[];
  schema: ZodSchema<T>;
  componentsMap: ComponentParam[];
};

let cachedRegistry: Record<string, TemplateMeta<any>> | null = null;

export function getTemplateRegistry(): Record<string, TemplateMeta<any>> {
  if (cachedRegistry) return cachedRegistry;

  const registry: Record<string, TemplateMeta<any>> = {};

  // Manually register each template
  const templates = [
    enquiryTemplateMeta,
  enquiryGreetingsTemplate,
  ];

  for (const template of templates) {
    registry[template.templateId] = template;
    console.log(`[Registry] Registered: ${template.templateId}`);
  }

  cachedRegistry = registry;
  return cachedRegistry;
}
