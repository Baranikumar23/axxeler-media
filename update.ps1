$html = Get-Content -Raw -Path "blogs.html"
$ids = @("artEcom", "artRealEstate", "artSpeed", "artAiAds", "artSemantic", "artHighTicket", "artYoutube")

for ($i = 0; $i -lt $ids.Length; $i++) {
    $id = $ids[$i]
    $artFile = "scratch\art$($i+1).txt"
    $newContent = Get-Content -Raw -Path $artFile
    
    # regex match for the article content
    $pattern = '(?s)(<article class="article-panel" id="' + $id + '".*?<div class="blog-content">).*?(</div>\s*</div>\s*</article>)'
    $html = $html -replace $pattern, ("`$1" + $newContent + "`$2")
}

Set-Content -Path "blogs.html" -Value $html
