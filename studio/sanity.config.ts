import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemaTypes';
import { SINGLETONS, structure } from './structure';

const singletonIds = new Set(SINGLETONS.map((s) => s.id));
const singletonTypes = new Set(SINGLETONS.map((s) => s.type));

export default defineConfig({
	name: 'spacecraft-associates',
	title: 'Spacecraft Associates',
	projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id',
	dataset: process.env.SANITY_STUDIO_DATASET || 'production',

	plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: '2025-09-01' })],

	schema: {
		types: schemaTypes,
		// Singletons can't be created from the global "New document" menu.
		templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType))
	},

	document: {
		// Singletons: no duplicate / delete / unpublish.
		actions: (actions, { schemaType, documentId }) =>
			singletonTypes.has(schemaType) || singletonIds.has(documentId ?? '')
				? actions.filter(
						({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action)
					)
				: actions,
		// Leads are created by the website only.
		newDocumentOptions: (prev, { creationContext }) =>
			creationContext.type === 'global'
				? prev.filter((t) => !singletonTypes.has(t.templateId) && t.templateId !== 'lead')
				: prev
	}
});
