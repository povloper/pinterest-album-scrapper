const request = require('request');

module.exports = {
    getAlbum
}

/**
 * Get all the information of the album including the publications (filtered or not)
 * 
 * @param {string} album_url album url caught from browser
 * @param {boolean} filtered if you want to filter the data of each post
 * 
 * @returns {object} Album information and posts
 */
async function getAlbum(album_url, filtered) {
    let album_id = album_url.replace(/^.*\/\/[^\/]+/, '');
    let board_id = (await getBoardIds(album_url))[0];
    let request_url = "https://www.pinterest.es/resource/BoardFeedResource/get/?source_url="+encodeURIComponent(album_id)+"&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22board_id%22%3A%22"+board_id+"%22%2C%22board_url%22%3A%22"+encodeURIComponent(album_id)+"%22%2C%22field_set_key%22%3A%22react_grid_pin%22%2C%22filter_section_pins%22%3Atrue%2C%22sort%22%3A%22default%22%2C%22layout%22%3A%22default%22%2C%22page_size%22%3A250%2C%22redux_normalize_feed%22%3Atrue%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1641065859000";
    
    let options = {
        list: [],
        album_url: album_url,
        album_id: album_id,
        board_id: board_id,
        request_url: request_url,
        album_name: "",
        filtered: filtered
    };

    await getAll(options);

    return options;
};

/**
 * Take the first page and call to take the others
 * 
 * @param {object} options object with all options and results
 * 
 * @returns {void}
 */
async function getAll(options) {
    return new Promise(function(resolve, reject) {
        request.get(options.request_url, async (error, response, data) => {
            data = JSON.parse(data);
            options.album_name = getAlbumName(data);
            if(data.resource_response) {
                addData(options, data);
                await getNext(options, data.resource_response.bookmark);
                resolve();
            }
        });       
    });
}

/**
 * Take the next page and call to take the others
 * 
 * @param {object} options object with all options and results
 * 
 * @returns {void}
 */
async function getNext(options, bookmark) {
    return new Promise(function(resolve, reject) {
        if(!bookmark) resolve();

        let request_url = 'https://www.pinterest.es/resource/BoardFeedResource/get/?data=%7B%22options%22%3A%7B%22bookmarks%22%3A%5B%22' + bookmark.replace(/==/g, '%3D%3D%').replace(/=/g, '%3D%') + '22%5D%2C%22isPrefetch%22%3Afalse%2C%22board_id%22%3A%22'+options.board_id+'%22%2C%22board_url%22%3A%22'+encodeURIComponent(options.album_url)+'%22%2C%22field_set_key%22%3A%22react_grid_pin%22%2C%22filter_section_pins%22%3Atrue%2C%22sort%22%3A%22default%22%2C%22layout%22%3A%22default%22%2C%22page_size%22%3A250%2C%22redux_normalize_feed%22%3Atrue%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1641065859000';
        request.get(request_url, async (error, response, data) => {
            data = JSON.parse(data);
            if(data.resource_response) {
                addData(options, data);
                await getNext(options, data.resource_response.bookmark);
                resolve();
            }
        });
    });
}

/**
 * Get all boards id's from album
 * 
 * @param {string} album_url album url caught from browser
 * 
 * @returns {string[]} with all boards id's
 */
function getBoardIds(album_url) {
    return new Promise(function(resolve, reject) {
        request.get(album_url, (error, response, data) => {
            let object = data.substring(data.search("__PWS_DATA__")-1);
            object = object.substring(object.search("\">")+2);
            object = object.slice(0, object.search("</script>"));
            object = JSON.parse(object);
    
            let boards = object.props.initialReduxState.boards;
            resolve(Object.keys(boards)); // [0]
        })
    });
}

/**
 * Get album name from response data
 * 
 * @param {object} data object with response data
 * 
 * @returns {string} album name
 */
function getAlbumName(data) {
    return data.resource_response.data[0].board.name.replace(/[/\\?%*:|"<>]/g, '-') ?? "";
}

/**
 * Add the new data to the collection object
 * 
 * @param {object} data object with response data
 * 
 * @returns {string} album name
 */
function addData(options, data) {
    if(options.filtered) {
        options.list = options.list.concat(data.resource_response.data.map((i, key) => {
            return {
                url: i && i.images ? i.images.orig.url : null,
                width: i && i.images ? i.images.orig.width : null,
                height: i && i.images ? i.images.orig.height : null,
                description: i.description,
                title: i.title,
            }
        }));
    } else {
        options.list = options.list.concat(data.resource_response.data);
    }
}