# How to run
## Option 1. Docker (pull from Docker Hub)
1. `docker run -p 3000:3000 thinkier/weather-app`
2. Navigate to http://localhost:3000

## Option 2. Docker (build locally)
0. Clone the repository
1. `docker build .`
2. `docker run -p 3000:3000 <hash>`
3. Navigate to http://localhost:3000

## Option 3. Node
0. Clone the repository
1. `npm install`
2. `node bin/www`
3. Navigate to http://localhost:3000

# Notes
- This is responsive and mobile friendly (using bulma)
- This is my first time dealing with node directly (I've previously used parceljs)
- I went with reference passing instead of using weak references for the navigation buttons
- Circular buffers are pretty easy in terms of technical challenges

# Libraries Used
- FontAwesome (weather / loading icons)
- Handlebars (used mainly for client side rendering)
- Express (web server)
- Bulma (and bulmaswatch theme: Darkly)
