export default {
    base: './',
    build: {
        rollupOptions: {
            input: {
                main: 'index.html',
                anime: 'anime-facts.html',
                about: 'about.html',
                contact: 'contact.html'
            }
        }
    }
}