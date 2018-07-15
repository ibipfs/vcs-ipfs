// PROJECT LOCATION
var root = 'QmaQSy8hzDRJRBrc37sAcX17AGTjwti9KTem4KvKXpL6YP';

// METAMASK CHECK
var metamask = new Metamask();
metamask.check();

// RENDER CONTENT
var render = new Render(root);
render.body();
render.footer();