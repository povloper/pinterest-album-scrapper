# pinterest-album-scrapper

Library to list entire pinterest albums.


## Install

First install through NPM:

`npm install @povloper/pinterest-album-scrapper`

Then import into your project:

`const scrapper = require("@povloper/pinterest-album-scrapper")`


## Warning

This library is still under development. If you find any errors you can freely make an issue or a pull request and I will be grateful


## Usage

You can pass the URL directly from the browser and it returns a list with the data of all the publications. You can also pass options to be able to filter the most interesting data (still developing).
You do not need any type of API Token, the albums must be public.


### getAlbum

Info

`scrapper.getAlbum(album_url, filtered = false)`

|Argument|Type|Description|
|-|-|-|
|album_url|String|`(www.)pinterest.(com/es/fr/...)` link, for example: `https://www.pinterest.es/{user_name}/{album_name}/` directly taken from the browser.|
|filtered|Boolean|Filter out some important parameters from each post if true. We are developing a more personalized filter|

It will return an object with some important data of the album in addition to the list (filtering data or not) of the publications. No promise needed.

|Key|Type|Description|
|-|-|-|
|album_url|String|The url received to list the posts.|
|album_id|String|Internal identifier of the album defined by Pinterest.|
|board_id|String|Identifier of the board that we have used.|
|album_name|String|User defined album name.|
|list|Object[]|List of all the publications found, whether filtering the data or not.|


## Contributing

We heavily value contributions, if you would like to contribute please feel free to put in a pull request.
