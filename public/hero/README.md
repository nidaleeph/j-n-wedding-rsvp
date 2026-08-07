# Hero background video

Drop the encoded video here as `hero.mp4` (plus `hero-poster.jpg` for the first
frame). `components/Hero.tsx` picks them up at build time; with no `hero.mp4`
present the hero falls back to the still `.hero-bg`.

Encode from the original with:

    ffmpeg -i original.mov -an -vf "scale=1920:-2" -c:v libx264 -crf 26 \
      -preset slow -pix_fmt yuv420p -movflags +faststart public/hero/hero.mp4
    ffmpeg -i public/hero/hero.mp4 -frames:v 1 -q:v 3 public/hero/hero-poster.jpg

`-an` drops the audio: the video is muted anyway (browsers refuse to autoplay
otherwise), so shipping the track is wasted bytes.
