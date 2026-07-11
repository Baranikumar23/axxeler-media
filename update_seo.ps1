$files = @("index.html", "about.html", "blogs.html", "case-studies.html", "contact.html", "partner.html")
$ogTags = @"
    <!-- Open Graph / Social Media Meta Tags -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="Axxeler | Premium Digital Marketing, Ads & SEO Agency">
    <meta property="og:description" content="Axxeler is an elite ROI-driven marketing agency specializing in Paid Ads, Content Marketing, SEO, Social Media, and Web Development.">
    <meta property="og:image" content="images/axxeler logo 3.png">
    <meta property="og:url" content="https://www.axxeler.com">
    <meta name="twitter:card" content="summary_large_image">
"@

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content -Raw -Path $file
        if ($content -notmatch "og:title") {
            $content = $content.Replace("<!-- Custom CSS -->", "$ogTags`r`n    <!-- Custom CSS -->")
            Set-Content -Path $file -Value $content
        }
    }
}
