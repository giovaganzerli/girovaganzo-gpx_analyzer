<template>
    <P5 id="app-canvas" :sketch="AppCanvas"/>
</template>

<style scoped>

</style>

<script setup>
const AppCanvas = (p5) => {

    let hMap = [];
    let res = 5;
    let thresh = 3;
    let t = 0;
    let move = true;
    var canvas;

    p5.setup = () => {
        canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
        canvas.position(0, 0);
        canvas.style('position', 'fixed');
        canvas.style('z-index', '-1');
        for (let i = 0; i < 1 + p5.width / res; i++) {
            hMap[i] = [];
            for (let j = 0; j < 1 + p5.height / res; j++) {
                hMap[i][j] = p5.noise(i / 50, j / 50) * 100;
            }
        }
    }

    p5.draw = () => {
        p5.background(255);
        if (move) {
            for (let i = 0; i < 1 + p5.width / res; i++) {
                hMap[i] = [];
                for (let j = 0; j < 1 + p5.height / res; j++) {
                    hMap[i][j] = p5.noise((i + t / 5) / 100, (j + p5.sin(t / 10)) / 100, t / 600) * 100;
                    p5.noStroke()
                    p5.fill(0, (p5.round(hMap[i][j]) - 25) * 5, 255 - (p5.round(hMap[i][j]) - 25) * 10)
                    //if (i % 5 == 0 && j % 5 == 0) p5.text(p5.round(hMap[i][j]), i * res, j * res)
                }
            }
            t += 1;
        }
        for (let i = 0; i < 1 + p5.width / res; i++) {
            for (let j = 0; j < 1 + p5.height / res; j++) {

                // strokeWeight(6);
                // point(i*res, j*res);
                // p5.text(p5.round(hMap[i][j]), i*res+7, j*res)

                if (i < p5.width / res && j < p5.height / res) {
                    let a = p5.floor(hMap[i][j] / thresh);
                    let b = p5.floor(hMap[i + 1][j] / thresh);
                    let c = p5.floor(hMap[i][j + 1] / thresh);
                    let d = p5.floor(hMap[i + 1][j + 1] / thresh);

                    let ab = 0;
                    let ac = 0;
                    let bcx = 0;
                    let bcy = 0;
                    let bd = 0;
                    let cd = 0;
                    let height = 0;

                    if (a != b) {
                        let contourValue = thresh * p5.max(a, b);
                        height = contourValue;
                        let diff = p5.abs(hMap[i][j] - hMap[i + 1][j]);
                        let add = p5.abs(hMap[i][j] - contourValue);
                        ab = i * res + res * add / diff;
                    }
                    if (a != c) {
                        let contourValue = thresh * p5.max(a, c);
                        height = contourValue;

                        let diff = p5.abs(hMap[i][j] - hMap[i][j + 1]);
                        let add = p5.abs(hMap[i][j] - contourValue);
                        ac = j * res + res * add / diff;
                    }
                    if (c != d) {
                        let contourValue = thresh * p5.max(c, d);
                        height = contourValue;

                        let diff = p5.abs(hMap[i][j + 1] - hMap[i + 1][j + 1]);
                        let add = p5.abs(hMap[i][j + 1] - contourValue);
                        cd = i * res + res * add / diff;
                    }
                    if (b != c) {
                        let contourValue = thresh * p5.max(b, c);
                        height = contourValue;

                        let diff = p5.abs(hMap[i + 1][j] - hMap[i][j + 1]);
                        let add = p5.abs(hMap[i + 1][j] - contourValue);
                        bcx = (i + 1) * res - res * add / diff;
                        bcy = j * res + res * add / diff;
                    }
                    if (b != d) {
                        let contourValue = thresh * p5.max(b, d);
                        height = contourValue;

                        let diff = p5.abs(hMap[i + 1][j] - hMap[i + 1][j + 1]);
                        let add = p5.abs(hMap[i + 1][j] - contourValue);
                        bd = j * res + res * add / diff;
                    }
                    p5.stroke(0, 188, 127);
                    //p5.stroke(0)
                    p5.strokeWeight(0.5)
                    if (height % 9 == 0) {
                        p5.strokeWeight(1)
                    }
                    if (ab) {
                        if (ac) {
                            p5.line(ab, j * res, i * res, ac);
                        }
                        if (bcx || bcy) {

                            p5.line(ab, j * res, bcx, bcy);
                        }
                    } else if (ac) {
                        if (bcx || bcy) {

                            p5.line(i * res, ac, bcx, bcy);
                        }
                    }
                    if (cd) {
                        if (bd) {

                            p5.line(cd, (j + 1) * res, (i + 1) * res, bd);
                        }
                        if (bcx || bcy) {

                            p5.line(cd, (j + 1) * res, bcx, bcy);
                        }
                    } else if (bd) {
                        if (bcx || bcy) {

                            p5.line((i + 1) * res, bd, bcx, bcy);
                        }
                    }
                }
            }
        }
    }

    p5.windowResized = () => {
        p5.setup();
    }
}
</script>