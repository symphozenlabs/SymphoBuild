/**
 * GROQ queries. Each projects documents into the view-model types in $lib/types.
 * The same queries run against Sanity or, in demo mode, against the local seed via groq-js.
 */

/** Image projection with LQIP placeholder (null in demo mode). */
const IMG = `{..., "lqip": asset->metadata.lqip}`;

const PROJECT_CARD = `
	_id, title, "slug": slug.current, status, propertyType, tagline, featured,
	location{locality, city},
	coverImage${IMG},
	bedrooms, areaRange, priceDisplay, priceFrom, priceTo,
	keyFacts[0...3]
`;

const SERVICE_CARD = `_id, title, "slug": slug.current, icon, summary, heroImage${IMG}`;

const TESTIMONIAL = `_id, quote, name, context, photo${IMG}, "project": project->{title, "slug": slug.current}`;

const FAQ = `_id, question, answer`;

const POST_CARD = `
	_id, title, "slug": slug.current, excerpt, publishedAt, featured,
	coverImage${IMG},
	"categories": categories[]->{_id, title, "slug": slug.current},
	"author": author->{name, role, photo${IMG}},
	"readMinutes": round(length(pt::text(body)) / 1100) + 1
`;

const GUIDE_CARD = `_id, title, "slug": slug.current, topic, icon, excerpt, checklist`;

export const LAYOUT_QUERY = `{
	"settings": *[_id == "siteSettings"][0]{..., logo${IMG}, seo{..., image${IMG}}},
	"navigation": *[_id == "navigation"][0]{main, headerCta},
	"footer": *[_id == "footer"][0]{statement, columns, legalLinks, disclaimer, instagram},
	"projectOptions": *[_type == "project" && defined(slug.current)] | order(order asc, title asc){title, "slug": slug.current, status},
	"serviceOptions": *[_type == "service" && defined(slug.current)] | order(order asc){title, "slug": slug.current}
}`;

export const HOME_QUERY = `*[_id == "homePage"][0]{
	hero{..., image${IMG}},
	statsHeading, stats,
	projectsHeading, projectsIntro,
	"featuredProjects": featuredProjects[]->{${PROJECT_CARD}},
	servicesHeading, servicesIntro,
	"services": *[_type == "service" && defined(slug.current)] | order(order asc){${SERVICE_CARD}},
	pillarsHeading, pillarsIntro, pillars,
	process,
	testimonialsHeading,
	"testimonials": testimonials[]->{${TESTIMONIAL}},
	insightsHeading, insightsIntro,
	"posts": *[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc)[0...3]{${POST_CARD}},
	faqHeading,
	"faqs": faqs[]->{${FAQ}},
	cta,
	seo
}`;

export const PROJECTS_QUERY = `*[_type == "project" && defined(slug.current)] | order(order asc, title asc){${PROJECT_CARD}}`;

export const PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0]{
	${PROJECT_CARD},
	location{locality, city, address, lat, lng},
	gallery[]${IMG},
	videoUrl, virtualTourUrl,
	overview, keyFacts, highlights, amenities, specifications,
	floorPlans[]{..., image${IMG}},
	units[]{..., floorPlan${IMG}},
	showInventory, approvals, rera, dtcpNumber, connectivity,
	"hasBrochure": defined(brochure.asset),
	"faqs": faqs[]->{${FAQ}},
	"relatedProjects": relatedProjects[]->{${PROJECT_CARD}},
	"updates": *[_type == "projectUpdate" && references(^._id)] | order(date desc){
		_id, title, date, progress, stage, summary, images[]${IMG}
	},
	seo{..., image${IMG}}
}`;

/** Server-only: resolves the brochure file for a project after lead capture. */
export const BROCHURE_QUERY = `*[_type == "project" && slug.current == $slug][0]{
	title, "url": brochure.asset->url, "ref": brochure.asset._ref
}`;

export const SERVICES_QUERY = `*[_type == "service" && defined(slug.current)] | order(order asc){${SERVICE_CARD}, deliverables}`;

export const SERVICE_QUERY = `*[_type == "service" && slug.current == $slug][0]{
	${SERVICE_CARD},
	body, process, deliverables, enquiryInterest,
	"relatedProjects": relatedProjects[]->{${PROJECT_CARD}},
	"faqs": faqs[]->{${FAQ}},
	"others": *[_type == "service" && slug.current != $slug] | order(order asc){title, "slug": slug.current, icon},
	seo{..., image${IMG}}
}`;

export const PAGE_QUERY = `*[_type == "page" && slug.current == $slug][0]{
	_id, _updatedAt, title, "slug": slug.current,
	hero{..., image${IMG}},
	sections[]{
		...,
		image${IMG},
		_type == "teamSection" => { "members": members[]->{_id, name, role, bio, linkedin, photo${IMG}} },
		_type == "faqSection" => { "faqs": faqs[]->{${FAQ}} },
		_type == "testimonialsSection" => { "testimonials": testimonials[]->{${TESTIMONIAL}} },
		_type == "projectsSection" => { "projects": projects[]->{${PROJECT_CARD}} }
	},
	"guides": select(
		count(sections[_type == "guideListSection"]) > 0 => *[_type == "buyerGuide" && defined(slug.current)] | order(order asc){${GUIDE_CARD}}
	),
	seo{..., image${IMG}}
}`;

export const POSTS_QUERY = `{
	"posts": *[_type == "blogPost" && defined(slug.current) && ($category == "" || $category in categories[]->slug.current)] | order(publishedAt desc)[$start...$end]{${POST_CARD}},
	"total": count(*[_type == "blogPost" && defined(slug.current) && ($category == "" || $category in categories[]->slug.current)]),
	"categories": *[_type == "blogCategory" && count(*[_type == "blogPost" && references(^._id)]) > 0] | order(title asc){_id, title, "slug": slug.current, description}
}`;

export const POST_QUERY = `*[_type == "blogPost" && slug.current == $slug][0]{
	${POST_CARD}, _updatedAt, body,
	"related": *[_type == "blogPost" && slug.current != $slug && count(categories[@._ref in ^.^.categories[]._ref]) > 0] | order(publishedAt desc)[0...3]{${POST_CARD}},
	"latest": *[_type == "blogPost" && slug.current != $slug] | order(publishedAt desc)[0...3]{${POST_CARD}},
	seo{..., image${IMG}}
}`;

export const GUIDE_QUERY = `*[_type == "buyerGuide" && slug.current == $slug][0]{
	${GUIDE_CARD}, _updatedAt, body,
	"others": *[_type == "buyerGuide" && slug.current != $slug] | order(order asc){${GUIDE_CARD}},
	seo{..., image${IMG}}
}`;

export const GALLERY_QUERY = `*[_type == "galleryItem" && defined(image.asset)] | order(order asc, _createdAt desc){
	_id, title, category, image${IMG}, "project": project->{title, "slug": slug.current}
}`;

export const REDIRECTS_QUERY = `*[_type == "redirect" && defined(source) && defined(destination)]{source, destination, permanent}`;

export const SITEMAP_QUERY = `{
	"projects": *[_type == "project" && defined(slug.current)]{"slug": slug.current, _updatedAt},
	"services": *[_type == "service" && defined(slug.current)]{"slug": slug.current, _updatedAt},
	"posts": *[_type == "blogPost" && defined(slug.current)]{"slug": slug.current, _updatedAt},
	"guides": *[_type == "buyerGuide" && defined(slug.current)]{"slug": slug.current, _updatedAt},
	"pages": *[_type == "page" && defined(slug.current) && seo.noIndex != true]{"slug": slug.current, _updatedAt}
}`;
