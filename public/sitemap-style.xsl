<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:html="http://www.w3.org/TR/REC-html40"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <!-- Root Template -->
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>
          <xsl:choose>
            <xsl:when test="sitemap:sitemapindex">Sitemap Index — The Vintage Press</xsl:when>
            <xsl:otherwise>Sitemap — The Vintage Press</xsl:otherwise>
          </xsl:choose>
        </title>
        <style>
          *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: #f8fafc;
            color: #1e293b;
            line-height: 1.5;
            padding: 32px 20px;
          }
          .container {
            max-width: 1280px;
            margin: 0 auto;
          }
          .header {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px 28px;
            margin-bottom: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          }
          .header-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 12px;
          }
          .brand {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .brand-badge {
            background: #4f46e5;
            color: #ffffff;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 4px 8px;
            border-radius: 6px;
          }
          h1 {
            font-size: 24px;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.02em;
          }
          .desc {
            color: #64748b;
            font-size: 14px;
            max-width: 800px;
            margin-bottom: 16px;
          }
          .stats-bar {
            display: flex;
            align-items: center;
            gap: 20px;
            flex-wrap: wrap;
            border-top: 1px solid #f1f5f9;
            padding-top: 16px;
          }
          .stat-item {
            display: flex;
            align-items: baseline;
            gap: 6px;
          }
          .stat-num {
            font-size: 20px;
            font-weight: 800;
            color: #0f172a;
          }
          .stat-label {
            font-size: 12px;
            font-weight: 500;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 16px;
          }
          .search-box {
            position: relative;
            flex: 1;
            min-width: 240px;
            max-width: 400px;
          }
          .search-input {
            width: 100%;
            padding: 10px 14px 10px 36px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            font-size: 14px;
            background: #ffffff;
            color: #0f172a;
            outline: none;
            transition: all 0.15s ease;
          }
          .search-input:focus {
            border-color: #4f46e5;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
          }
          .search-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
            font-size: 14px;
            pointer-events: none;
          }
          .locale-filters {
            display: flex;
            align-items: center;
            gap: 6px;
            flex-wrap: wrap;
          }
          .filter-btn {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            color: #475569;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.15s ease;
          }
          .filter-btn:hover {
            border-color: #cbd5e1;
            background: #f1f5f9;
          }
          .filter-btn.active {
            background: #0f172a;
            color: #ffffff;
            border-color: #0f172a;
          }
          .table-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          }
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 13px;
          }
          thead th {
            background: #f8fafc;
            color: #475569;
            font-weight: 700;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            padding: 12px 16px;
            border-bottom: 1px solid #e2e8f0;
            cursor: pointer;
            user-select: none;
            white-space: nowrap;
          }
          thead th:hover {
            background: #f1f5f9;
            color: #0f172a;
          }
          tbody tr {
            border-bottom: 1px solid #f1f5f9;
            transition: background-color 0.1s ease;
          }
          tbody tr:hover {
            background: #f8fafc;
          }
          tbody td {
            padding: 12px 16px;
            vertical-align: middle;
          }
          .col-num {
            color: #94a3b8;
            font-weight: 600;
            width: 48px;
            text-align: center;
          }
          .col-url {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 12.5px;
            max-width: 460px;
            word-break: break-all;
          }
          .col-url a {
            color: #2563eb;
            text-decoration: none;
            transition: color 0.1s ease;
          }
          .col-url a:hover {
            color: #1d4ed8;
            text-decoration: underline;
          }
          .col-date {
            color: #475569;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 12px;
            white-space: nowrap;
          }
          .badge-locale {
            display: inline-block;
            font-size: 11px;
            font-weight: 700;
            padding: 2px 7px;
            border-radius: 4px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }
          .loc-en { background: #e0e7ff; color: #3730a3; }
          .loc-de { background: #fef3c7; color: #92400e; }
          .loc-es { background: #d1fae5; color: #065f46; }
          .loc-fr { background: #e0f2fe; color: #075985; }
          .loc-hi { background: #ffe4e6; color: #9f1239; }
          .loc-ja { background: #fae8ff; color: #86198f; }
          .loc-ko { background: #ede9fe; color: #5b21b6; }
          .loc-pt-br { background: #dcfce7; color: #166534; }
          .loc-ru { background: #ffedd5; color: #9a3412; }
          .loc-tr { background: #f1f5f9; color: #334155; }
          .loc-zh { background: #fee2e2; color: #991b1b; }
          .badge-counter {
            background: #f1f5f9;
            color: #475569;
            font-weight: 700;
            font-size: 11px;
            padding: 2px 6px;
            border-radius: 9999px;
            margin-left: 4px;
          }
          .alternates-pill {
            display: inline-flex;
            align-items: center;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 2px 8px;
            font-size: 11px;
            color: #475569;
            font-weight: 600;
          }
          .empty-state {
            padding: 48px 16px;
            text-align: center;
            color: #94a3b8;
          }
          .footer {
            margin-top: 24px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
          }
          .footer a {
            color: #64748b;
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header Card -->
          <div class="header">
            <div class="header-top">
              <div class="brand">
                <span class="brand-badge">XML SITEMAP</span>
                <h1>The Vintage Press</h1>
              </div>
              <div>
                <a href="/robots.txt" style="font-size: 13px; color: #4f46e5; text-decoration: none; font-weight: 600;">
                  View robots.txt &#8599;
                </a>
              </div>
            </div>
            
            <p class="desc">
              <xsl:choose>
                <xsl:when test="sitemap:sitemapindex">
                  This sitemap index file is generated for automated search engine crawlers (Google, Bing, Yandex). An XSL stylesheet is applied for human review and debugging.
                </xsl:when>
                <xsl:otherwise>
                  This XML sitemap lists all indexable canonical pages, localized hreflang alternates, and last modification dates for search engine indexing.
                </xsl:otherwise>
              </xsl:choose>
            </p>

            <div class="stats-bar">
              <xsl:choose>
                <xsl:when test="sitemap:sitemapindex">
                  <div class="stat-item">
                    <span class="stat-num" id="sitemapCount">
                      <xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/>
                    </span>
                    <span class="stat-label">Sub-Sitemaps</span>
                  </div>
                </xsl:when>
                <xsl:otherwise>
                  <div class="stat-item">
                    <span class="stat-num" id="totalCount">
                      <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/>
                    </span>
                    <span class="stat-label">Total URLs</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-num">11</span>
                    <span class="stat-label">Locales</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-num" id="visibleCount">
                      <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/>
                    </span>
                    <span class="stat-label">Showing</span>
                  </div>
                </xsl:otherwise>
              </xsl:choose>
            </div>
          </div>

          <!-- Toolbar for URL Set -->
          <xsl:if test="sitemap:urlset">
            <div class="toolbar">
              <div class="search-box">
                <span class="search-icon">&#128269;</span>
                <input type="text" id="urlFilter" class="search-input" placeholder="Filter by URL or slug..." oninput="handleSearch(this.value)"/>
              </div>
              <div class="locale-filters">
                <button class="filter-btn active" onclick="filterLocale('all', this)">All</button>
                <button class="filter-btn" onclick="filterLocale('en', this)">EN</button>
                <button class="filter-btn" onclick="filterLocale('de', this)">DE</button>
                <button class="filter-btn" onclick="filterLocale('es', this)">ES</button>
                <button class="filter-btn" onclick="filterLocale('fr', this)">FR</button>
                <button class="filter-btn" onclick="filterLocale('hi', this)">HI</button>
                <button class="filter-btn" onclick="filterLocale('zh', this)">ZH</button>
                <button class="filter-btn" onclick="filterLocale('ja', this)">JA</button>
                <button class="filter-btn" onclick="filterLocale('ko', this)">KO</button>
                <button class="filter-btn" onclick="filterLocale('pt-BR', this)">PT-BR</button>
                <button class="filter-btn" onclick="filterLocale('ru', this)">RU</button>
                <button class="filter-btn" onclick="filterLocale('tr', this)">TR</button>
              </div>
            </div>
          </xsl:if>

          <!-- Table Container -->
          <div class="table-card">
            <xsl:choose>
              <!-- Sitemap Index Mode -->
              <xsl:when test="sitemap:sitemapindex">
                <table id="sitemapTable">
                  <thead>
                    <tr>
                      <th class="col-num">#</th>
                      <th onclick="sortTable(1, 'sitemapTable')">Sitemap Location &#8645;</th>
                      <th onclick="sortTable(2, 'sitemapTable')">Last Modified &#8645;</th>
                    </tr>
                  </thead>
                  <tbody>
                    <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                      <tr>
                        <td class="col-num"><xsl:value-of select="position()"/></td>
                        <td class="col-url">
                          <a href="{sitemap:loc}">
                            <xsl:value-of select="sitemap:loc"/>
                          </a>
                        </td>
                        <td class="col-date">
                          <xsl:value-of select="sitemap:lastmod"/>
                        </td>
                      </tr>
                    </xsl:for-each>
                  </tbody>
                </table>
              </xsl:when>

              <!-- URL Set Mode -->
              <xsl:otherwise>
                <table id="urlTable">
                  <thead>
                    <tr>
                      <th class="col-num">#</th>
                      <th onclick="sortTable(1, 'urlTable')">URL Location &#8645;</th>
                      <th onclick="sortTable(2, 'urlTable')">Locale &#8645;</th>
                      <th onclick="sortTable(3, 'urlTable')">Alternates &#8645;</th>
                      <th onclick="sortTable(4, 'urlTable')">Last Modified &#8645;</th>
                      <th>Changefreq</th>
                      <th>Priority</th>
                    </tr>
                  </thead>
                  <tbody id="urlTableBody">
                    <xsl:for-each select="sitemap:urlset/sitemap:url">
                      <!-- Detect locale from URL -->
                      <xsl:variable name="loc" select="sitemap:loc"/>
                      <xsl:variable name="locale">
                        <xsl:choose>
                          <xsl:when test="contains($loc, '/zh/')">zh</xsl:when>
                          <xsl:when test="contains($loc, '/pt-BR/')">pt-BR</xsl:when>
                          <xsl:when test="contains($loc, '/ru/')">ru</xsl:when>
                          <xsl:when test="contains($loc, '/ja/')">ja</xsl:when>
                          <xsl:when test="contains($loc, '/tr/')">tr</xsl:when>
                          <xsl:when test="contains($loc, '/ko/')">ko</xsl:when>
                          <xsl:when test="contains($loc, '/de/')">de</xsl:when>
                          <xsl:when test="contains($loc, '/es/')">es</xsl:when>
                          <xsl:when test="contains($loc, '/fr/')">fr</xsl:when>
                          <xsl:when test="contains($loc, '/hi/')">hi</xsl:when>
                          <xsl:otherwise>en</xsl:otherwise>
                        </xsl:choose>
                      </xsl:variable>

                      <tr data-locale="{$locale}" data-url="{$loc}">
                        <td class="col-num"><xsl:value-of select="position()"/></td>
                        <td class="col-url">
                          <a href="{$loc}" target="_blank">
                            <xsl:value-of select="$loc"/>
                          </a>
                        </td>
                        <td>
                          <span class="badge-locale loc-{$locale}">
                            <xsl:value-of select="$locale"/>
                          </span>
                        </td>
                        <td>
                          <xsl:variable name="altCount" select="count(xhtml:link[@rel='alternate'])"/>
                          <xsl:choose>
                            <xsl:when test="$altCount &gt; 0">
                              <span class="alternates-pill" title="Includes {$altCount} localized hreflang links">
                                &#127760; <xsl:value-of select="$altCount"/> locales
                              </span>
                            </xsl:when>
                            <xsl:otherwise>
                              <span style="color: #94a3b8;">—</span>
                            </xsl:otherwise>
                          </xsl:choose>
                        </td>
                        <td class="col-date">
                          <xsl:choose>
                            <xsl:when test="sitemap:lastmod">
                              <xsl:value-of select="sitemap:lastmod"/>
                            </xsl:when>
                            <xsl:otherwise>
                              <span style="color: #94a3b8;">—</span>
                            </xsl:otherwise>
                          </xsl:choose>
                        </td>
                        <td style="color: #64748b; font-size: 12px;">
                          <xsl:choose>
                            <xsl:when test="sitemap:changefreq">
                              <xsl:value-of select="sitemap:changefreq"/>
                            </xsl:when>
                            <xsl:otherwise>
                              <span style="color: #94a3b8;">—</span>
                            </xsl:otherwise>
                          </xsl:choose>
                        </td>
                        <td style="color: #64748b; font-size: 12px; font-weight: 600;">
                          <xsl:choose>
                            <xsl:when test="sitemap:priority">
                              <xsl:value-of select="sitemap:priority"/>
                            </xsl:when>
                            <xsl:otherwise>
                              <span style="color: #94a3b8;">—</span>
                            </xsl:otherwise>
                          </xsl:choose>
                        </td>
                      </tr>
                    </xsl:for-each>
                  </tbody>
                </table>
              </xsl:otherwise>
            </xsl:choose>
          </div>

          <div class="footer">
            Generated with <a href="https://astro.build" target="_blank">Astro</a> &#38; 
            <a href="https://github.com/withastro/astro/tree/main/packages/integrations/sitemap" target="_blank">@astrojs/sitemap</a>.
            XSL stylesheet rendered natively in browser.
          </div>
        </div>

        <script><![CDATA[
          let activeLocale = 'all';
          let activeQuery = '';

          function updateFilters() {
            const rows = document.querySelectorAll('#urlTableBody tr');
            let visibleCount = 0;
            rows.forEach(row => {
              const rowLocale = (row.getAttribute('data-locale') || '').toLowerCase();
              const rowUrl = (row.getAttribute('data-url') || '').toLowerCase();
              const matchesLocale = (activeLocale === 'all' || rowLocale === activeLocale.toLowerCase());
              const matchesQuery = (!activeQuery || rowUrl.includes(activeQuery));
              if (matchesLocale && matchesQuery) {
                row.style.display = '';
                visibleCount++;
              } else {
                row.style.display = 'none';
              }
            });
            const counter = document.getElementById('visibleCount');
            if (counter) counter.textContent = visibleCount;
          }

          function filterLocale(loc, btn) {
            activeLocale = loc;
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            if (btn) btn.classList.add('active');
            updateFilters();
          }

          function handleSearch(val) {
            activeQuery = (val || '').trim().toLowerCase();
            updateFilters();
          }

          let sortDirections = {};
          function sortTable(colIndex, tableId) {
            const table = document.getElementById(tableId);
            if (!table) return;
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            const currentDir = sortDirections[colIndex] || 'asc';
            const multiplier = currentDir === 'asc' ? 1 : -1;

            rows.sort((a, b) => {
              const aVal = (a.children[colIndex]?.textContent || '').trim();
              const bVal = (b.children[colIndex]?.textContent || '').trim();
              return aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' }) * multiplier;
            });

            rows.forEach(r => tbody.appendChild(r));
            sortDirections[colIndex] = currentDir === 'asc' ? 'desc' : 'asc';
          }
        ]]></script>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
