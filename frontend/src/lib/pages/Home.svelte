<script>
    import { link } from 'svelte-spa-router'
</script>

<div class="block items-center">
    <div class="hero h-screen w-full bg-home">
        <div class="hero-content flex-col lg:flex-row-reverse">
          <img src="https://placeimg.com/260/400/arch" class="rounded-lg shadow-2xl w-48 md:w-96" alt="animation"/>
          <div>
            <h1 class="text-8xl font-bold">New Game Website!</h1>
            <p class="py-6 text-xl">Register here for free and join us to play many games</p>
            <a class="btn btn-secondary" use:link href="/register">Get Started</a>
          </div>
        </div>
      </div>
        <div class="hero h-screen bg-base-200">
          <div class="hero-content text-center">
            <div class="max-w-md">
              <h1 class="text-5xl font-bold">Hello there</h1>
              <p class="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
            </div>
          </div>
        </div>
</div>
