class CubeMap {
    constructor(gl, urls) {
        this.gl = gl;
        this.texture = gl.createTexture();
        this.loaded = false;

        const old_tex_binding = gl.getParameter(gl.TEXTURE_BINDING_CUBE_MAP);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);

        //defaults to blue
        const placeholder = new Uint8Array([0, 0, 255, 255]);
        const targets = [
            gl.TEXTURE_CUBE_MAP_POSITIVE_X,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
        ];

        targets.forEach(target => {
            gl.texImage2D(target, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, placeholder);
        });

        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

        if (old_tex_binding === null) {
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, old_tex_binding);
        }

        let loadedCount = 0;
        let _tex = this;

        targets.forEach((target, i) => {
            const image = new Image();
            image.onload = function () {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, _tex.texture);
                gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

                loadedCount++;
                if (loadedCount === 6) {
                    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                    _tex.loaded = true;
                    console.log("Cubemap fully loaded!");
                }
            };
            image.src = urls[i];
        });
    }

    bind(gl, unit = 0) {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
    }
}
