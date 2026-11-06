import {
	CogIcon,
	HomeIcon,
	MenuIcon,
	BlockElementIcon,
	InboxIcon,
	ProjectsIcon,
	ActivityIcon,
	WrenchIcon,
	DocumentIcon,
	DocumentTextIcon,
	TagIcon,
	BookIcon,
	ImagesIcon,
	UsersIcon,
	CommentIcon,
	HelpCircleIcon,
	ArrowRightIcon,
	ControlsIcon
} from './icons';
import type { StructureBuilder, StructureResolver } from 'sanity/structure';

export const SINGLETONS = [
	{ id: 'siteSettings', type: 'siteSettings', title: 'Site settings', icon: CogIcon },
	{ id: 'homePage', type: 'homePage', title: 'Home page', icon: HomeIcon },
	{ id: 'navigation', type: 'navigation', title: 'Navigation', icon: MenuIcon },
	{ id: 'footer', type: 'footer', title: 'Footer', icon: BlockElementIcon }
];

const singleton = (S: StructureBuilder, s: (typeof SINGLETONS)[number]) =>
	S.listItem()
		.title(s.title)
		.icon(s.icon)
		.id(s.id)
		.child(S.document().schemaType(s.type).documentId(s.id).title(s.title));

const leadList = (S: StructureBuilder, title: string, filter: string) =>
	S.listItem()
		.title(title)
		.child(
			S.documentList()
				.title(title)
				.schemaType('lead')
				.filter(`_type == "lead" && (${filter})`)
				.defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
		);

export const structure: StructureResolver = (S) =>
	S.list()
		.title('Spacecraft Associates')
		.items([
			S.listItem()
				.title('Leads')
				.icon(InboxIcon)
				.child(
					S.list()
						.title('Leads')
						.items([
							leadList(S, '🆕 New', 'status == "new" || !defined(status)'),
							leadList(
								S,
								'🔄 In progress',
								'status in ["contacted", "qualified", "siteVisit", "negotiation"]'
							),
							leadList(S, '🏆 Won', 'status == "won"'),
							leadList(S, '🗂️ Closed (lost / spam)', 'status in ["lost", "spam"]'),
							S.divider(),
							leadList(S, 'Project enquiries', 'enquiryType == "project"'),
							leadList(S, 'Landowner enquiries', 'enquiryType == "landowner"'),
							leadList(S, 'Brochure requests', 'enquiryType == "brochure"'),
							leadList(S, 'All leads', 'true')
						])
				),
			S.divider(),
			singleton(S, SINGLETONS[1]),
			S.listItem()
				.title('Projects')
				.icon(ProjectsIcon)
				.child(
					S.list()
						.title('Projects')
						.items([
							S.documentTypeListItem('project').title('All projects'),
							...['upcoming', 'ongoing', 'ready', 'completed'].map((status) =>
								S.listItem()
									.title(
										status === 'ready' ? 'Ready to move' : status[0].toUpperCase() + status.slice(1)
									)
									.child(
										S.documentList()
											.title(status)
											.schemaType('project')
											.filter('_type == "project" && status == $status')
											.params({ status })
									)
							),
							S.divider(),
							S.documentTypeListItem('projectUpdate')
								.title('Construction updates')
								.icon(ActivityIcon)
						])
				),
			S.documentTypeListItem('service').title('Services').icon(WrenchIcon),
			S.documentTypeListItem('page').title('Pages').icon(DocumentIcon),
			S.listItem()
				.title('Insights')
				.icon(DocumentTextIcon)
				.child(
					S.list()
						.title('Insights')
						.items([
							S.documentTypeListItem('blogPost').title('Articles'),
							S.documentTypeListItem('blogCategory').title('Categories').icon(TagIcon)
						])
				),
			S.documentTypeListItem('buyerGuide').title("Buyer's guide").icon(BookIcon),
			S.documentTypeListItem('galleryItem').title('Gallery').icon(ImagesIcon),
			S.divider(),
			S.documentTypeListItem('teamMember').title('Team').icon(UsersIcon),
			S.documentTypeListItem('testimonial').title('Testimonials').icon(CommentIcon),
			S.documentTypeListItem('faq').title('FAQs').icon(HelpCircleIcon),
			S.divider(),
			S.listItem()
				.title('Settings')
				.icon(ControlsIcon)
				.child(
					S.list()
						.title('Settings')
						.items([
							singleton(S, SINGLETONS[0]),
							singleton(S, SINGLETONS[2]),
							singleton(S, SINGLETONS[3]),
							S.documentTypeListItem('redirect').title('Redirects').icon(ArrowRightIcon)
						])
				)
		]);
