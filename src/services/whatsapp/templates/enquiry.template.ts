import { z } from 'zod';
import { TemplateMeta } from './templateRgistry';

const enquirySchema = z.object({
    fullName: z.string(),
    companyName: z.string(),
    businessEmail: z.string().email(),
    mobileNumber: z.string(),
    location: z.string(),
    message: z.string(),
    submittedAt: z.date().optional()
});

type EnquiryData = z.infer<typeof enquirySchema>;

export const templateMeta: TemplateMeta<EnquiryData> = {
    templateId: 'enquiry_ace_soft',
    name: 'Enquiry Form',
    placeholders: [
        'fullName',
        'companyName',
        'businessEmail',
        'mobileNumber',
        'location',
        'message'
        // optional: 'submittedAt'
    ],
    schema: enquirySchema,
    componentsMap: [
        { key: 'fullName', type: 'text', component: 'body' },
        { key: 'companyName', type: 'text', component: 'body' },
        { key: 'businessEmail', type: 'text', component: 'body' },
        { key: 'mobileNumber', type: 'text', component: 'body' },
        { key: 'location', type: 'text', component: 'body' },
        { key: 'message', type: 'text', component: 'body' }
    ]
};