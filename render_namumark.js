function render_namumark(target) {
    function get_today() {
        var today_data = new Date();

        return '' +
            String(today_data.getFullYear()) + '-' + 
            String(today_data.getMonth() + 1) + '-' + 
            String(today_data.getDate()) + ' ' + 
            (today_data.getHours() < 10 ? '0' + String(today_data.getHours()) : String(today_data.getHours())) + ':' + 
            (today_data.getMinutes() < 10 ? '0' + String(today_data.getMinutes()) : String(today_data.getMinutes())) + ':' + 
            (today_data.getSeconds() < 10 ? '0' + String(today_data.getSeconds()) : String(today_data.getSeconds())) +
        '';
    }

    data = document.getElementById(target).innerHTML;

    data = data.replace(/\n/g, '<br>');

    data = data.replace(/~~((?:(?!~~).)+)~~/gm, '<s>$1</s>');
    data = data.replace(/--((?:(?!--).)+)--/gm, '<s>$1</s>');
    data = data.replace(/__((?:(?!__).)+)__/gm, '<u>$1</u>');
    data = data.replace(/'''((?:(?!''').)+)'''/gm, '<b>$1</b>');
    data = data.replace(/''((?:(?!'').)+)''/gm, '<i>$1</i>');
    data = data.replace(/\^\^((?:(?!\^\^).)+)\^\^/gm, '<sup>$1</sup>');
    data = data.replace(/,,((?:(?!,,).)+),,/gm, '<sub>$1</sub>');

    var toc_array = [0, 0, 0, 0, 0, 0];
    var before_data = 0;
    var toc_data = '<div id="toc"><span id="toc_title">TOC</span><br><br>'
    data = data.replace(/(={1,6}) ?([^=]+) ?={1,6}<br>/g, function(all, num, in_data) {
        num = num.length;
        
        if(before_data > num) {
            var i = num;
            while(1) {
                if(i == 6) {
                    break;
                }

                toc_array[i] = 0;
                i += 1;
            }
        }

        before_data = num;
        toc_array[num - 1] += 1;
        num = String(num);
        var toc_num = (toc_array.join('.') + '.').replace(/0\./g, '');
        toc_data += '' + 
            '<span style="margin-left: ' + String(10 * (toc_num.length / 2) - 10) + 'px;">' + 
                '<a href="#s-' + toc_num.replace(/\.$/, '') + '">' + toc_num + '</a> ' + in_data + 
            '</span>' +
            '<br>' + 
        '';

        return '<h' + num + ' id="s-' + toc_num.replace(/\.$/, '') + '"><a href="#toc">' + toc_num + '</a> ' + in_data + '</h' + num + '>';
    });

    toc_data += '</div>';

    data = data.replace(/\[([^(]+)\(((?:(?!\)]).)+)\)]/g, function(all, name, in_data) {
        if(name.match(/^youtube|kakaotv|nicovideo$/i)) {
            var video_code = in_data.match(/^([^,]+)/);
            if(video_code) {
                video_code = video_code[1];
            } else {
                video_code = 'test';
            }

            if(name === 'youtube') {
                var video_src = 'https://www.youtube.com/embed/' + video_code
            } else if(name === 'kakaotv') {
                var video_src = 'https://tv.kakao.com/embed/player/cliplink/' + video_code +'?service=kakao_tv'
            } else {
                var video_src = 'https://embed.nicovideo.jp/watch/' + video_code
            }

            var width_data = in_data.match(/, *width=([^,]+)/);
            if(width_data) {
                width_data = width_data[1];
            } else {
                width_data = '560';
            }

            var height_data = in_data.match(/, *height=([^,]+)/);
            if(height_data) {
                height_data = height_data[1];
            } else {
                height_data = '315';
            }

            return '' +
                '<iframe ' +
                    'width="' + width_data + '" ' +
                    'height="' + height_data + '" ' +
                    'src="' + video_src + '" ' +
                    'allowfullscreen>' +
                '</iframe>' +
            '';
        } else if(name.match(/^ruby$/i)) {
            var main_text = in_data.match(/^([^,]+)/);
            if(main_text) {
                main_text = main_text[1];
            } else {
                main_text = 'test';
            }

            var ruby_text = in_data.match(/, *ruby=([^,]+)/);
            if(ruby_text) {
                ruby_text = ruby_text[1];
            } else {
                ruby_text = 'test';
            }

            var color_text = in_data.match(/, *color=([^,]+)/);
            if(color_text) {
                color_text = 'color:' + color_text[1];
            } else {
                color_text = '';              
            }

            return '' +
                '<ruby>' + main_text +
                    '<rp>(</rp>' +
                    '<rt>' +
                        '<span style="' + color_text + '">' + ruby_text + '</span>' +
                    '</rt>' +
                    '<rp>)</rp>' +
                '</ruby>' +
            '';
        } else {
            return all;
        }
    });

    data = data.replace(/\[([^\]]+)\]/g, function(all, name) {
        if(name.match(/^br$/i)) {
            return '<br>'
        } else if(name.match(/^목차$/i)) {
            return toc_data;
        } else if(name.match(/^date|datetime$/i)) {
            return get_today();
        } else {
            return all;
        }
    });

    document.getElementById(target).innerHTML = data;
}