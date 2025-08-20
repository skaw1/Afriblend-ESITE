
import React from 'react';

const ReportSection: React.FC<{ title: string; children: React.ReactNode; level?: number }> = ({ title, children, level = 2 }) => {
    const Heading = `h${level}` as keyof JSX.IntrinsicElements;
    const titleClass = level === 1 ? 'text-3xl font-serif font-bold text-brand-primary dark:text-dark-text' : 
                       level === 2 ? 'text-2xl font-serif font-semibold text-brand-primary dark:text-dark-text' : 
                       'text-xl font-serif font-medium text-brand-primary dark:text-dark-text';

    return (
        <section className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md space-y-4">
            <Heading className={titleClass}>{title}</Heading>
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-dark-subtext">
                {children}
            </div>
        </section>
    );
};

const KeywordTable: React.FC = () => {
    const keywords = [
        { keyword: "buy ankara dress", type: "Head/Transactional", intent: "Commercial", difficulty: "Medium" },
        { keyword: "kente cloth jacket online", type: "Head/Transactional", intent: "Commercial", difficulty: "Medium" },
        { keyword: "masai jewelry shop", type: "Head/Transactional", intent: "Commercial", difficulty: "Medium" },
        { keyword: "mudcloth pillows for sale", type: "Head/Transactional", intent: "Commercial", difficulty: "Medium" },
        { keyword: "modern dashiki shirts", type: "Head/Transactional", intent: "Commercial", difficulty: "Medium" },
        { keyword: "authentic african fashion", type: "Head/Transactional", intent: "Commercial", difficulty: "Medium" },
        { keyword: "african print dresses", type: "Head/Transactional", intent: "Commercial", difficulty: "Medium" },
        { keyword: "african clothing online", type: "Head/Transactional", intent: "Commercial", difficulty: "Medium" },
        { keyword: "what is shweshwe fabric", type: "Informational", intent: "Informational", difficulty: "Low" },
        { keyword: "how to style a dashiki", type: "Informational", intent: "Informational", difficulty: "Low" },
        { keyword: "history of ankara fabric", type: "Informational", intent: "Informational", difficulty: "Low" },
        { keyword: "meaning of kente patterns", type: "Informational", intent: "Informational", difficulty: "Low" },
        { keyword: "sustainable african fashion brands", type: "Informational", intent: "Informational", difficulty: "Medium" },
        { keyword: "how to care for mudcloth", type: "Informational", intent: "Informational", difficulty: "Low" },
        { keyword: "handmade masai beaded collar necklace", type: "Long-Tail", intent: "Commercial", difficulty: "Low" },
        { keyword: "men's modern kente bomber jacket", type: "Long-Tail", intent: "Commercial", difficulty: "Low" },
        { keyword: "authentic nigerian ankara fabric online", type: "Long-Tail", intent: "Commercial", difficulty: "Low" },
        { keyword: "ethical mudcloth throw pillows brooklyn", type: "Long-Tail", intent: "Commercial", difficulty: "Low" },
        { keyword: "african print jumpsuits for special occasions", type: "Long-Tail", intent: "Commercial", difficulty: "Low" },
        { keyword: "Can you wash mudcloth?", type: "Question-Based", intent: "Informational", difficulty: "Low" },
        { keyword: "What is the difference between Ankara and Kitenge?", type: "Question-Based", intent: "Informational", difficulty: "Low" },
        { keyword: "Where does kente cloth come from?", type: "Question-Based", intent: "Informational", difficulty: "Low" },
        { keyword: "How are masai beads made?", type: "Question-Based", intent: "Informational", difficulty: "Low" },
        { keyword: "Is African fashion sustainable?", type: "Question-Based", intent: "Informational", difficulty: "Medium" },
        { keyword: "african fashion store in Nairobi", type: "Local/Geographic", intent: "Commercial/Local", difficulty: "Low" },
        { keyword: "ankara fabric suppliers in [city/region]", type: "Local/Geographic", intent: "Commercial/Local", difficulty: "Low" },
        { keyword: "modern african fashion Los Angeles", type: "Local/Geographic", intent: "Commercial/Local", difficulty: "Low" },
    ];

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Keyword</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Keyword Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Search Intent</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Estimated Difficulty</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-dark-card dark:divide-dark-border">
                    {keywords.map((item, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">{item.keyword}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-subtext">{item.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-subtext">{item.intent}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-subtext">{item.difficulty}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const CompetitorTable: React.FC = () => {
    const competitors = [
        { url: "https://www.diyanu.com/", niche: "Ready-to-wear African-inspired fashion", strengths: "Strong product categorization, affordable & on-trend focus, clear brand identity as \"black-owned\"", keywords: "\"African print maxi dress,\" \"men's African print shirt,\" \"African inspired clothing,\" \"affordable African fashion\"", gap: "Deep cultural narratives, artisan stories, and educational content beyond product descriptions." },
        { url: "https://industrieafrica.com/", niche: "Luxury African fashion & designers", strengths: "Luxury positioning, curated collections, industry resource (\"IA Connect\")", keywords: "\"luxury African fashion,\" \"African designer dresses,\" \"Tongoro collection,\" \"made to order African fashion\"", gap: "Foundational cultural aspects of African textiles, detailed artisan processes, consumer-friendly cultural education." },
        { url: "https://www.lolasafricanapparel.com/", niche: "Authentic African clothing, Made in Nigeria", strengths: "Strong authenticity & provenance claims, existing content marketing (blog), personal brand & expertise of owner", keywords: "\"authentic African clothing,\" \"mudcloth history,\" \"Nigerian made dashiki,\" \"African print fashion tips\"", gap: "Comprehensive coverage of diverse African textiles beyond mudcloth, broader cultural meanings, and a more focused blog." },
        { url: "https://www.themaasaimarket.com/", niche: "Ethically sourced Maasai jewelry & African decor", strengths: "Niche specialization, explicit ethical sourcing, cultural content (blog)", keywords: "\"Maasai bead necklaces,\" \"ethically sourced African jewelry,\" \"Maasai market online,\" \"African home decor\"", gap: "Broader connection of different African cultures and textile traditions, integration into contemporary global fashion." },
        { url: "https://africanclothinghub.com/", niche: "African Ankara print clothing for ladies", strengths: "Product specialization (Ankara), quality & craftsmanship emphasis, trend focus", keywords: "\"Ankara print dresses,\" \"plus size African Ankara dress,\" \"African print clothing wedding,\" \"Kente print maxi dress\"", gap: "Deep cultural storytelling, ethical/sustainable aspects of production, and the broader narrative behind the fabrics." },
    ];
    
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Competitor URL</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Primary Niche/Focus</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Key SEO Strengths</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Top 3-5 Inferred Keywords</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Identified Content Gap for Afriblend</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-dark-card dark:divide-dark-border">
                    {competitors.map((item, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 dark:text-indigo-400 hover:underline"><a href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a></td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-dark-text">{item.niche}</td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-dark-subtext">{item.strengths}</td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-dark-subtext">{item.keywords}</td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-dark-subtext">{item.gap}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const AdminSeoReportPage: React.FC = () => {
    return (
        <div className="space-y-8">
            <ReportSection title="Comprehensive SEO Strategy for Afriblend: Dominating Modern African Fashion Online" level={1}>
                <p>This report outlines a strategic SEO framework for Afriblend, an e-commerce store specializing in modern African fashion, accessories, and home decor. The objective is to significantly increase organic traffic, enhance search engine rankings for high-intent keywords, and firmly establish Afriblend as a leading authority within its unique niche. The strategy is data-informed, highly actionable, and leverages Afriblend's core unique selling proposition (USP): blending traditional African artistry with contemporary design, focusing on authenticity and artisan empowerment.</p>
            </ReportSection>

            <ReportSection title="1. Foundational Keyword Research">
                <p>A systematic approach to keyword research is paramount for capturing high-intent traffic across the entire customer journey, from initial discovery and research to direct purchase. This process involves identifying terms that Afriblend's target audience—fashion-conscious consumers (ages 25-50) worldwide, interested in unique, handcrafted items, cultural stories, and sustainable/ethical fashion—is actively searching for. The aim is to cover transactional terms for immediate sales, informational queries for authority building, and long-tail phrases for niche capture.</p>
                <p>By categorizing keywords, Afriblend gains a clear understanding of the types of content and optimization efforts required. Transactional keywords demand direct product page optimization, while informational keywords necessitate blog posts and comprehensive guides. This structured approach prevents a scattergun method and ensures resources are directed effectively toward achieving specific goals. Understanding search intent is critical; a user searching for "buy ankara dress" has a clear commercial intent, requiring a well-optimized product page. Conversely, a query like "what is shweshwe fabric" indicates an informational need best served by a detailed blog post or guide. Aligning content with user intent reduces bounce rates and significantly increases conversion potential.</p>
                <p>The diverse range of keyword types ensures Afriblend captures potential customers at every stage of their buying journey, from initial curiosity and research to specific product searches and final purchase decisions. This comprehensive coverage builds a robust and resilient organic presence.</p>
                <h3 className="text-xl font-serif font-medium text-brand-primary dark:text-dark-text mt-6 mb-2">Keyword List Generation</h3>
                <h4 className="font-semibold mt-4">Head/Transactional Keywords:</h4>
                <p>These are high-volume, direct-intent keywords targeting immediate purchase.</p>
                <ul className="list-disc pl-8">
                    <li>"buy ankara dress"</li>
                    <li>"kente cloth jacket online"</li>
                    <li>"masai jewelry shop"</li>
                    <li>"mudcloth pillows for sale"</li>
                    <li>"modern dashiki shirts"</li>
                    <li>"authentic african fashion"</li>
                    <li>"african print dresses"</li>
                    <li>"african clothing online"</li>
                </ul>
                <h4 className="font-semibold mt-4">Informational Keywords:</h4>
                <p>These address user queries seeking knowledge or context, crucial for building topical authority and attracting top-of-funnel traffic.</p>
                 <ul className="list-disc pl-8">
                    <li>"what is shweshwe fabric"</li>
                    <li>"how to style a dashiki"</li>
                    <li>"history of ankara fabric"</li>
                    <li>"meaning of kente patterns"</li>
                    <li>"sustainable african fashion brands"</li>
                    <li>"how to care for mudcloth"</li>
                </ul>
                <h4 className="font-semibold mt-4">Long-Tail Keywords:</h4>
                <p>Highly specific phrases indicating strong intent, often with lower competition and higher conversion rates.</p>
                 <ul className="list-disc pl-8">
                    <li>"handmade masai beaded collar necklace"</li>
                    <li>"men's modern kente bomber jacket"</li>
                    <li>"authentic nigerian ankara fabric online"</li>
                    <li>"ethical mudcloth throw pillows brooklyn"</li>
                    <li>"african print jumpsuits for special occasions"</li>
                </ul>
                 <h4 className="font-semibold mt-4">Question-Based Keywords:</h4>
                <p>Designed to capture queries for "People Also Ask" sections and FAQs, directly addressing common user inquiries.</p>
                 <ul className="list-disc pl-8">
                    <li>"Can you wash mudcloth?"</li>
                    <li>"What is the difference between Ankara and Kitenge?"</li>
                    <li>"Where does kente cloth come from?"</li>
                    <li>"How are masai beads made?"</li>
                    <li>"Is African fashion sustainable?"</li>
                </ul>
                 <h4 className="font-semibold mt-4">Local/Geographic Keywords (if applicable):</h4>
                <p>While Afriblend targets a global audience, incorporating local keywords can capture specific regional interest or potential future physical presence.</p>
                 <ul className="list-disc pl-8">
                    <li>"african fashion store in Nairobi"</li>
                    <li>"ankara fabric suppliers in [city/region]"</li>
                    <li>"modern african fashion Los Angeles"</li>
                </ul>

                <h3 className="text-xl font-serif font-medium text-brand-primary dark:text-dark-text mt-6 mb-2">Foundational Keyword Research for Afriblend</h3>
                <KeywordTable />

                <h3 className="text-xl font-serif font-medium text-brand-primary dark:text-dark-text mt-6 mb-2">Strategic Implications from Keyword Analysis</h3>
                <p>A critical understanding is that Afriblend's strategy should extend beyond broad transactional keywords to heavily invest in long-tail and highly specific niche keywords that precisely reflect its unique product blend and USP. This approach allows Afriblend to carve out distinct topical authority within these sub-niches, leading to higher conversion rates due to precise intent matching and reduced direct competition. It also necessitates very detailed and descriptive product and category page content to fully capitalize on these specific searches.</p>
                <p>Furthermore, Afriblend's unique selling proposition, explicitly including "authenticity and artisan empowerment," can serve as a powerful keyword multiplier. By proactively integrating terms like "authentic African," "handcrafted," "ethically sourced," and "fair trade African fashion" into both transactional and informational keywords, Afriblend can tap into a highly motivated, values-driven consumer base. This strategy not only improves rankings for these specific, less competitive niche queries but also deeply resonates with the target audience's stated interest, fostering trust and brand loyalty.</p>
            </ReportSection>

            <ReportSection title="2. Competitor Analysis">
                <p>Identifying and analyzing primary online competitors provides crucial insights into the market landscape, highlighting successful SEO strategies and pinpointing content gaps that Afriblend can strategically exploit to gain market share and establish authority. The following competitors have been identified as key players: D'IYANU, Industrie Africa, Lola's African Apparel, The Maasai Market, and Africanclothinghub.com.</p>
                <h3 className="text-xl font-serif font-medium text-brand-primary dark:text-dark-text mt-6 mb-2">Competitor SEO Analysis</h3>
                <CompetitorTable />
                <h3 className="text-xl font-serif font-medium text-brand-primary dark:text-dark-text mt-6 mb-2">Strategic Implications from Competitor Analysis</h3>
                <p>A significant observation is that the "storytelling" content gap appears to be universal and high-value. Afriblend has a profound opportunity to become the definitive online resource for the cultural narratives, historical context, and artisan processes behind modern African fashion. This will not only capture a significant volume of informational search intent but also build immense brand credibility, trust, and emotional connection with the target audience.</p>
                <p>Another critical observation is that the "ethical/sustainable" niche is growing and appears under-optimized. By aggressively targeting keywords and content themes related to "ethical African fashion," "sustainable African textiles," and "fair trade African clothing," Afriblend can attract a highly engaged and values-driven segment of the market, differentiating itself beyond aesthetics and price.</p>
            </ReportSection>

            <ReportSection title="3. Content Strategy & Topic Cluster Model">
                 <p>A robust content marketing strategy centered on a "Pillar Page and Cluster Content" model is proposed to establish Afriblend as a leading authority in modern African fashion. This approach is designed to build deep topical relevance and effectively serve informational search intent, positioning Afriblend as a go-to resource for cultural understanding and style inspiration.</p>
                <h3 className="text-xl font-serif font-medium text-brand-primary dark:text-dark-text mt-6 mb-2">Pillar Page Proposal</h3>
                <p><strong>Topic: "The Ultimate Guide to African Fabrics & Textiles"</strong></p>
                <ul className="list-disc pl-8 space-y-2">
                    <li><strong>H1:</strong> The Ultimate Guide to African Fabrics & Textiles: History, Meaning, and Modern Style</li>
                    <li><strong>H2:</strong> The Rich Tapestry of African Textiles: A Historical Overview</li>
                    <li><strong>H2:</strong> Iconic African Fabrics: Characteristics, Cultural Significance, and Modern Applications (with H3s for Ankara, Kente, Mudcloth, etc.)</li>
                    <li><strong>H2:</strong> Beyond the Fabric: The Artisans and Sustainability of African Textiles</li>
                    <li><strong>H2:</strong> Styling Your African Textiles: From Traditional to Contemporary</li>
                    <li><strong>H2:</strong> Conclusion: Embracing the Legacy of African Fashion with Afriblend</li>
                </ul>

                <h3 className="text-xl font-serif font-medium text-brand-primary dark:text-dark-text mt-6 mb-2">Cluster Content Ideas</h3>
                <p>These supporting blog posts will link back to the pillar page, reinforcing topical authority and capturing specific long-tail queries.</p>
                <ul className="list-disc pl-8">
                    <li>"Ankara vs. Kitenge: A Guide to West and East African Prints"</li>
                    <li>"How to Care for Your Mudcloth Textiles to Make Them Last"</li>
                    <li>"5 Modern Ways to Style a Kente Scarf"</li>
                    <li>"The Royal History Behind Ghanaian Kente Cloth"</li>
                    <li>"Dashiki: From Traditional Garment to Global Fashion Statement"</li>
                    <li>"Beyond the Beads: The Symbolism and Craftsmanship of Maasai Jewelry"</li>
                    <li>"Why African Fabrics Are the Future of Sustainable Fashion"</li>
                </ul>
            </ReportSection>

            <ReportSection title="4. On-Page & Technical SEO Recommendations">
                <h3 className="text-xl font-serif font-medium text-brand-primary dark:text-dark-text mt-6 mb-2">Schema Markup</h3>
                <p>Implementing structured data is critical for enhancing search engine understanding and generating rich results. Key schemas to implement include: <strong>Product, Offer, FAQPage, Article, BreadcrumbList,</strong> and <strong>Organization</strong>.</p>
                
                <h3 className="text-xl font-serif font-medium text-brand-primary dark:text-dark-text mt-6 mb-2">URL Structure</h3>
                <p>Clear, concise, and descriptive URLs are vital for both user experience and SEO.</p>
                <p><strong>Product Page Example:</strong> <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">https://www.afriblend.com/dresses/ankara-gowns/ankara-infinity-gown-blue-print</code></p>
                <p><strong>Blog Post Example:</strong> <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">https://www.afriblend.com/blog/african-fabrics/how-to-style-kente-scarf</code></p>

                <h3 className="text-xl font-serif font-medium text-brand-primary dark:text-dark-text mt-6 mb-2">Image SEO</h3>
                <p>Optimizing images is crucial for visual search and page speed. Use descriptive alt-text and file names.</p>
                <p><strong>Good Alt-Text:</strong> <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">alt="Women's Ankara Infinity Gown in vibrant blue and yellow geometric print, flowing silhouette"</code></p>
                <p><strong>Good File Name:</strong> <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">ankara-infinity-gown-blue-yellow-geometric-print.jpg</code></p>
            </ReportSection>

            <ReportSection title="5. Link Building Strategy">
                <p>Acquiring high-quality backlinks is crucial for enhancing domain authority. A strategic approach focuses on relevance, authority, and alignment with Afriblend's brand values.</p>
                <h3 className="text-xl font-serif font-medium text-brand-primary dark:text-dark-text mt-6 mb-2">Target Profiles for Backlinks</h3>
                <ul className="list-disc pl-8">
                    <li>Ethical Fashion Blogs/Publications</li>
                    <li>African Cultural/Heritage Websites & Museums</li>
                    <li>Artisan Empowerment Organizations/NGOs</li>
                    <li>Lifestyle/Travel Influencers (African Focus)</li>
                </ul>
                <h3 className="text-xl font-serif font-medium text-brand-primary dark:text-dark-text mt-6 mb-2">Actionable Tactic: "Fabric of Africa" Interactive Map Campaign</h3>
                <p>Develop a visually engaging, interactive online map that highlights the origins, historical significance, and artisan communities behind various African fabrics. This valuable resource would naturally attract links from educational, cultural, and fashion websites.</p>
            </ReportSection>

            <ReportSection title="6. Executive Summary & Top Priorities">
                <p>Afriblend is uniquely positioned to become a leading authority in its niche by blending products with rich cultural narratives and ethical practices. The analysis reveals a widespread under-optimization of deep cultural storytelling and explicit ethical positioning among competitors, creating a clear path for Afriblend to differentiate and dominate.</p>
                <h3 className="text-xl font-serif font-medium text-brand-primary dark:text-dark-text mt-6 mb-2">Top 3 Most Impactful SEO Actions</h3>
                <ol className="list-decimal pl-8 space-y-2">
                    <li><strong>Develop and Promote the "Ultimate Guide to African Fabrics & Textiles" Pillar Page:</strong> This serves as the cornerstone of the content strategy, establishing deep topical authority and attracting high-quality backlinks.</li>
                    <li><strong>Implement Comprehensive Product & Organization Schema Markup with Localization:</strong> This is critical for enhancing visibility in product searches, displaying rich snippets, and boosting click-through rates in a global marketplace.</li>
                    <li><strong>Launch a Targeted Link Building Campaign Focused on Ethical/Cultural Partnerships:</strong> This leverages the rich content and unique brand USP to acquire high-quality, relevant backlinks that reinforce authority and improve search rankings.</li>
                </ol>
            </ReportSection>
        </div>
    );
};

export default AdminSeoReportPage;
