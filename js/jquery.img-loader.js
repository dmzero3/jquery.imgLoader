// UTF-8

/*******************************
*
*　jquery.imgLoader
*  Dai Matsuura (https://twitter.com/dog_big_fat)
*  特定ブロック内のimg要素が全て読み込み完了するまでローディングUIを表示 
*
*******************************/
(function($){

    $.fn.imgLoader = function(option){
        var defaults = {
            'loadingObj': '.js_loading',
            'isAjax': true,
            'imgSrcArray': [],
            'loadingType': null,
            'indicatorCss': {
                'width': '200px',
                'height': '20px',
                'border': '1px solid #000'
            },
            'indicatorBarColor': '#f00',
            'countText': '読み込み完了',
            'callback': null
        };

        return this.each(function(){
            $self = $(this);

            var config = $.extend(defaults, option);

            var img = [];
            var $imgArray;

            if(config.isAjax){
                var imgArray = [];
                for(var i = 0; i < config.imgSrcArray.length; i++){
                    var imgObj = new Image();
                    imgObj.src = config.imgSrcArray[i];
                    imgArray.push(imgObj);    
                }
                $imgArray = $(imgArray);
            }
            else{
                $imgArray = $self.find('img');
            }
            var imgLength = $imgArray.length;
            var restImgLength = imgLength;

            //loadingType
            switch(config.loadingType){
                case 'indicator':
                    $(config.loadingObj).append($('<div class="loader-indicator"><div class="loader-indicator__bar" />'));
                    $indicator = $('.loader-indicator');
                    $indicatorBar = $('.loader-indicator__bar');
                    $indicator.css(config.indicatorCss);
                    $indicatorBar.css({
                        'width': 0,
                        'height': '100%',
                        'background-color': config.indicatorBarColor
                    });
                    break;

                case 'count':
                    $(config.loadingObj).append($('<div class="loader-count" />'));
                    $count = $('.loader-count');
                    break;

                default: 
                    break;
            }

            for(var i = 0; i < imgLength; i++){
                img[i] = new Image();
                img[i].onload = function(){
                    
                    restImgLength = restImgLength - 1;

                    switch(config.loadingType){
                        case 'indicator':
                            $indicatorBar.css({
                                'width': ((imgLength - restImgLength) / imgLength * 100) + '%'
                            });
                            break;
                        case 'count':
                            $count.text((imgLength - restImgLength) + '/' + imgLength + config.countText);
                            break;
                        default: 
                            break;
                    }


                   
                    //全ての画像の読み込みが完了したら
                    if(restImgLength == 0){
                        $(config.loadingObj).hide();
                        $self.fadeIn(500);

                        if(config.callback){
                            config.callback();
                        }
                    }
                }
                img[i].src = $imgArray.eq(i).attr('src');
                if(config.isAjax){
                    $self.append($imgArray.eq(i));
                }
            }
        });
    };

})(jQuery);