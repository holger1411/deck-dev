import { DateTime } from "luxon";
import navigationPlugin from "@11ty/eleventy-navigation";
import rssPlugin from "@11ty/eleventy-plugin-rss";
import Image from "@11ty/eleventy-img";
import EleventyFetch from "@11ty/eleventy-fetch";

export default function(eleventyConfig) {
  // Universal Shortcodes (Adds to Liquid, Nunjucks, Handlebars)
  eleventyConfig.addShortcode("bgImg", function(imgName, test) {
    return `
    <style>
  .bg-img {
       background-image: url(./img/webp/${imgName}.webp);
   }
   @media only screen and (max-width: 576px) {
       .bg-img {
           background-image: url(./img/webp/${imgName}_xs.webp);
       }
   }
   @media only screen and (max-width: 992px) {
       .bg-img {
           background-image: url(./img/webp/${imgName}_xs.webp);
       }
   }
   @media only screen and (max-width: 1440px) {
       .bg-img {
           background-image: url(./img/webp/${imgName}_md.webp);
       }
   }
   @media only screen and (min-width: 1441px) {
       .bg-img {
           background-image: url(./img/webp/${imgName}_xl.webp);
       }
   }
   </style>
    `;
  });

  // blogposts collection
    eleventyConfig.addCollection("components", function (collection) {
      return collection.getFilteredByGlob("./src/components/*.njk").reverse();
    });

  function filterTagList(tags) {
    return (tags || []).filter(tag => ["all", "nav"].indexOf(tag) === -1);
  }
  eleventyConfig.setDataDeepMerge(true);

  function filterTagList(tags) {
    return (tags || []).filter(tag => ["all", "nav", "post", "posts"].indexOf(tag) === -1);
  }

  eleventyConfig.addFilter("filterTagList", filterTagList)
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addCollection("tagList", collection => {
    const tagsObject = {}
    collection.getAll().forEach(item => {
      if (!item.data.tags) return;
      item.data.tags
        .filter(tag => !['post', 'all'].includes(tag))
        .forEach(tag => {
          if(typeof tagsObject[tag] === 'undefined') {
            tagsObject[tag] = 1
          } else {
            tagsObject[tag] += 1
          }
        });
    });

    const tagList = []
    Object.keys(tagsObject).forEach(tag => {
      tagList.push({ tagName: tag, tagCount: tagsObject[tag] })
    })
    return tagList.sort((a, b) => b.tagCount - a.tagCount)

  });


  // Add a filter using the Config API
  eleventyConfig.addWatchTarget("./src/scss/");
  eleventyConfig.setBrowserSyncConfig({
    reloadDelay: 400
  });

  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {
      zone: 'utc'
    }).toFormat("dd LLL yyyy");
  });

  eleventyConfig.addCollection('componentstotal', (collection) => {
    return collection.getFilteredByGlob('_components/**/*.njk');
});

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {
      zone: 'utc'
    }).toFormat('yyyy-LL-dd');
  });
  return {
    dir: {
      input: "src",
      output: "dev"
    }
  };

};
