export function Hero() {
  const section = document.createElement('section');
  section.id = 'hero';
  section.className = 'container py-12 text-center';
  section.innerHTML = `
    <h1 class="text-4xl md:text-5xl font-bold mb-4" style="background: linear-gradient(90deg, hsl(210,70%,55%), hsl(210,70%,35%)); -webkit-background-clip: text; color: transparent;">
      Your college network doesn't end at graduation.
    </h1>
    <p class="text-lg text-muted mb-6">Reconnect with your alumni community, discover opportunities, find mentors, and build meaningful professional relationships.</p>
    <div class="flex justify-center space-x-4">
      <button class="btn btn-primary" id="exploreBtn">Explore Alumni</button>
      <button class="btn" id="joinBtn" style="background:#fff; color:var(--color-primary); border:1px solid var(--color-primary);">Join AlumniConnect</button>
    </div>
    <div class="mt-8">
      <img src="/assets/network-illustration.svg" alt="Connected alumni network" style="max-width:100%; height:auto;" />
    </div>`;
  return section;
}
