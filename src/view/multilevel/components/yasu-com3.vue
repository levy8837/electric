<template>
    <div>
        <svg width="100%" height="100%" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
            <!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ -->
            <g>
                <title>background</title>
                <rect fill="#191919" id="canvas_background" height="402" width="802" y="-1" x="-1" />
                <g display="none" overflow="visible" y="0" x="0" height="100%" width="100%" id="canvasGrid">
                    <rect fill="url(#gridpattern)" stroke-width="0" y="0" x="0" height="100%" width="100%" />
                </g>
            </g>
            <g>
                <title>Layer 1</title>
                <text xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="24"
                    id="svg_1" y="50.4375" x="254.65625" stroke-width="0" stroke="#000" fill="#ffffff">浙江亚设塑业厂3#欧式箱变</text>
            </g>
        </svg>
    </div>
</template>
<script>
    export default {
        name: 'level_2_3',
        data() {
            return {
                Uab: 221,
                Uac: 222,
                Ubc: 220,
                PT: 220,
                Ia: 2.9,
                Ib: 0.6,
                Ic: 0,
                P: 0.8,
            }
        },
        methods: {
            chengedData() {
                this.Uab = (Math.random() * 2 + 409).toFixed(1);
                this.Uac = (Math.random() * 2 + 409).toFixed(1);
                this.Ubc = (Math.random() * 2 + 409).toFixed(1);
                this.PT = (Math.random() * 2).toFixed(2);
                this.Ia = Math.random().toFixed(2);
                this.Ib = Math.random().toFixed(2);
                this.Ic = Math.random().toFixed(2);
                this.P = (Math.random() * 2).toFixed(2);
            }
        },
        mounted() {
            if (this.timer) {
                clearInterval(this.timer);
            } else {
                this.timer = setInterval(() => {
                    this.chengedData();
                }, 1000)
            };
        },
        beforeDestroy() {
            clearInterval(this.timer);
        }
    }

</script>
