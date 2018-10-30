'use strict';

import Vue from 'vue'

let cache_ = {}; //global cache

export default {
    data: function() {
        return {
        }
    },

    methods: {
        get_cache: function(id) {
            //console.log("looking for ", id);
            if(cache_[id]) {
                let now = (new Date()).getTime();
                if(cache_[id].exp < now) {
                    //console.log("expired", cache_[id].exp, now);
                    return null;
                }
                //console.log("using cache", id);
                return cache_[id].it; //good!
            }
            return null;
        },  

        set_cache(id, it, ttl) {
            if(!ttl) ttl = 600; //10 minute default
            let now = (new Date()).getTime();
            let exp = now + ttl*1000;
            //console.log("setting ", id, it);
            cache_[id] = {it, exp};
        },
    }
}

