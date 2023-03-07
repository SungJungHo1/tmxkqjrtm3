/** @type {import('next').NextConfig} */
const nextConfig = {
  
  eslint: {
    dirs: ['pages', 'templates', 'components', 'store', 'libs', 'hooks', 'app', '__tests__'], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    images: {
        unoptimized: true
    }
}
  // api_key를 마스킹 하고 싶을 때 아래 rewrites 예제 코드 주석 해제
  // Uncomment the rewrites example code below when you want to mask the api_key

  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/movies",
  //       destination: `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`,
  //     },
  //   ];
  // },
}

module.exports = nextConfig
