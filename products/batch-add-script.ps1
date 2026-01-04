# PowerShell script to add the mobile-menu.js script to all product HTML files
$files = Get-ChildItem -Path . -Filter "*.html"

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Check if the script is already included
    if ($content -notmatch "mobile-menu\.js") {
        # Replace the closing body tag with the script and the closing body tag
        $newContent = $content -replace "</body>", '<script src="../js/mobile-menu.js"></script></body>'
        
        # Write the modified content back to the file
        Set-Content -Path $file.FullName -Value $newContent
        
        Write-Host "Added mobile-menu.js to $($file.Name)"
    } else {
        Write-Host "mobile-menu.js already exists in $($file.Name)"
    }
} 