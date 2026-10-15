param(
  [Parameter(Mandatory = $true)][string]$SourcePath,
  [Parameter(Mandatory = $true)][string]$DestinationPath
)

Add-Type -AssemblyName System.Drawing
$source = [System.Drawing.Image]::FromFile($SourcePath)
$output = $null
$graphics = $null
$attributes = $null
try {
  $output = [System.Drawing.Bitmap]::new($source.Width * 2, $source.Height * 2, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $graphics = [System.Drawing.Graphics]::FromImage($output)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

  $matrix = [System.Drawing.Imaging.ColorMatrix]::new()
  $matrix.Matrix00 = 1.08
  $matrix.Matrix11 = 1.08
  $matrix.Matrix22 = 1.08
  $matrix.Matrix40 = 0.035
  $matrix.Matrix41 = 0.035
  $matrix.Matrix42 = 0.035
  $attributes = [System.Drawing.Imaging.ImageAttributes]::new()
  $attributes.SetColorMatrix($matrix, [System.Drawing.Imaging.ColorMatrixFlag]::Default, [System.Drawing.Imaging.ColorAdjustType]::Bitmap)

  $destination = [System.Drawing.Rectangle]::new(0, 0, $output.Width, $output.Height)
  $graphics.DrawImage($source, $destination, 0, 0, $source.Width, $source.Height, [System.Drawing.GraphicsUnit]::Pixel, $attributes)
  $output.Save($DestinationPath, [System.Drawing.Imaging.ImageFormat]::Png)
  "Enhanced image saved at $($output.Width)x$($output.Height)"
}
finally {
  if ($attributes) { $attributes.Dispose() }
  if ($graphics) { $graphics.Dispose() }
  if ($output) { $output.Dispose() }
  $source.Dispose()
}
