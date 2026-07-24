# Consilium Growth

Static site. No build step, no dependencies. Plain HTML, CSS and one small JS file.

## Structure

    index.html          Homepage
    contact.html        Contact page with Formspree form
    CNAME               Custom domain for GitHub Pages
    .nojekyll           Stops Jekyll processing
    robots.txt
    sitemap.xml
    assets/css/style.css
    assets/js/main.js   Hero rotator and mobile nav
    assets/img/         Treated imagery

## Before it goes live

1. Formspree. Create a form, then replace REPLACE_WITH_FORM_ID in contact.html.
2. Confirm hello@consiliumgrowth.com receives mail.
3. Replace the imagery with licensed or original photography. Everything in assets/img is a placeholder.
4. UAE Ministry of Economy trademark search on Consilium Growth.
5. Confirm the licensed IP case is publicly nameable before naming any client.

## Deploy on GitHub Pages

1. Create a repository. Public is required for Pages on a free account.
2. Upload every file, keeping the folder structure. Commit to the default branch.
3. Settings, Pages, Source, Deploy from a branch. Branch main, folder / (root). Save.
4. Settings, Pages, Custom domain, enter consiliumgrowth.com and save. The CNAME file is already in the repo.
5. Tick Enforce HTTPS once the certificate is issued. This can take up to an hour.

## DNS at the registrar

Apex records, all four A records:

    185.199.108.153
    185.199.109.153
    185.199.110.153
    185.199.111.153

And one CNAME:

    www  ->  USERNAME.github.io

Propagation is usually under an hour and can take up to 24.

## Editing

All copy is in the HTML. Hero statements are in assets/js/main.js in the `lines` array. Colours are CSS custom properties at the top of style.css.

## Notes

Type is Archivo and Inter from Google Fonts. Display uses the condensed width axis at 75 per cent.
Text contrast on the dark surfaces passes WCAG AA.
