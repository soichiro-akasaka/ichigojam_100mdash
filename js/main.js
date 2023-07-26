const { createApp, ref } = Vue
createApp({
    setup() {
        const title = ref('100メートルダッシュ ランキングボード')
        if (!localStorage.getItem("rank_data")) {
            // データを作成
            const rank_data = [];
            localStorage.setItem('rank_data', JSON.stringify(rank_data));
        }
        const rank_data_json = localStorage.getItem("rank_data")
        const rank_data = JSON.parse(rank_data_json)
        const data = ref(rank_data)

        const name = ref('');
        const time = ref('');
        const recentName = ref('');
        const recentTime = ref('');

        const setRankData = () => {
            if (name.value && time.value) {
                // name.valueの平仮名をカタカナに変換
                let inputName = name.value;
                inputName = inputName.replace(/[ぁ-ん]/g, function(s) {
                    return String.fromCharCode(s.charCodeAt(0) + 0x60);
                });
                let inputTime = time.value;
                // 小数点1位まで表示
                inputTime = parseFloat(inputTime).toFixed(1);
                data.value.push([inputName, inputTime]);
                // タイムでソート
                sortByTime();
                localStorage.setItem('rank_data', JSON.stringify(data.value));
                setRecentData(inputName, inputTime);
                name.value = '';
                time.value = '';
            }
        }

        const setRecentData = (name,time) => {
            recentName.value = name;
            recentTime.value = time;
        }

        const sortByTime = () => {
            data.value.sort(function(a, b) {
                // 数値に変換してソート
                if (parseFloat(a[1]) < parseFloat(b[1])) { return -1;}
                if (parseFloat(a[1]) > parseFloat(b[1])) { return 1; }
                return 0;
            });
        }
        
        sortByTime();

        return {
            title,
            data,
            name,
            time,
            recentName,
            recentTime,
            setRankData
        }
    }
}).mount('#app')