# Project Images & Videos

This directory contains organized folders for each project's assets.

## Folder Structure

Each project has its own folder:
- `vireo/` - Vireo Wellness Brand Refresh
- `solara/` - Solara Smart Home Launch Video
- `orbitpay/` - OrbitPay Corporate Web Presence
- `neuroniq/` - NeuronIQ Explainer Video Series
- `echo/` - Echo Social Media Data Suite
- `boost/` - Boost E-commerce Store Redesign
- `nova/` - Nova Brand Style Guide
- `clarity/` - Clarity Patient Education Portal
- `nanobot/` - Nanobot 3D Mascot & Motion

## File Naming Convention

### Preview Video (Required)
- `preview.mp4` - Short looping video for project card preview (recommended: 5-15 seconds, muted, looping)

### Gallery Images (10 images per project)
- `image-1.jpg` through `image-10.jpg` - Project gallery images
- Images should be high quality (recommended: 1920x1080 or higher)
- Supported formats: JPG, PNG, WebP

## Example Structure

```
img/projects/
├── vireo/
│   ├── preview.mp4
│   ├── image-1.jpg
│   ├── image-2.jpg
│   ├── ...
│   └── image-10.jpg
├── solara/
│   ├── preview.mp4
│   ├── image-1.jpg
│   └── ...
└── ...
```

## Notes

- If a video file is missing, the component will fallback to the project's fallback image
- If gallery images are missing, placeholder images will be shown
- All images should be optimized for web (compressed but maintaining quality)

