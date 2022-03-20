/* eslint-disable */
import 'babylonjs-loaders';
import 'babylonjs/Oimo.js';

import * as BABYLON from 'babylonjs';
import * as BGUI from 'babylonjs-gui';

/* eslint-enable */

class App {
	private engine: BABYLON.Engine;
	private scene: BABYLON.Scene;
	private camera: BABYLON.ArcRotateCamera;
	private light: BABYLON.Light;

	constructor(canvas: HTMLCanvasElement) {
		this.engine = new BABYLON.Engine(canvas, true, {
			preserveDrawingBuffer: true,
			stencil: true,
			disableWebGL2Support: false,
		});

		this.scene = new BABYLON.Scene(this.engine);
		this.scene.clearColor = new BABYLON.Color4(0, 0, 0);

		// This creates and positions a free camera (non-mesh)
		this.camera = new BABYLON.ArcRotateCamera(
			'Camera',
			(3 * Math.PI) / 2,
			Math.PI / 2.5,
			8,
			new BABYLON.Vector3(0, 2, 0),
			this.scene,
		);

		this.camera.attachControl(canvas, true);

		this.camera.lowerRadiusLimit = 6;
		this.camera.upperRadiusLimit = 20;

		this.camera.useBouncingBehavior = true;

		// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
		this.light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene);

		this.light.intensity = 0.7;

		const gravityVector = new BABYLON.Vector3(0, -3, 0);
		this.scene.enablePhysics(gravityVector, new BABYLON.OimoJSPlugin());

		const gl = new BABYLON.GlowLayer('glow', this.scene, {
			mainTextureSamples: 4,
		});
		gl.customEmissiveColorSelector = function (mesh, subMesh, material, result) {
			if (mesh.name === 'sphere') {
				result.set(0.960784314, 0.019607843, 0.309803922, 0.8);
			} else if (mesh.name === 'heart') {
				result.set(0.960784314, 0, 0.341176471, 1);
			} else {
				result.set(0, 0, 0, 0);
			}
		};

		const advancedTexture = BGUI.AdvancedDynamicTexture.CreateFullscreenUI('UI', undefined, this.scene);
		const textblock = new BGUI.TextBlock();
		textblock.text = 'Happy Birthday!';
		textblock.fontSize = 36;
		textblock.left = window.innerWidth / 2 - 200;
		textblock.top = window.innerHeight / 2 - 80;
		textblock.color = 'white';
		advancedTexture.addControl(textblock);

		BABYLON.SceneLoader.ImportMeshAsync(['heart'], '/models/', 'heart.gltf', this.scene);

		let ticker = 0;

		this.scene.registerBeforeRender(() => {
			if (ticker++ % 60) return;

			for (let i = 0; i < 40; i++) {
				setTimeout(() => {
					const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 0.1, segments: 32 }, this.scene);

					const sphereMaterial = new BABYLON.StandardMaterial('sphereMaterial', this.scene);
					sphereMaterial.alpha = 1;
					sphereMaterial.diffuseColor = new BABYLON.Color3(0.960784314, 0.019607843, 0.309803922);
					sphere.material = sphereMaterial;

					// Move the sphere upward 1/2 its height
					sphere.position.x = randomBetween(-20, 20);
					sphere.position.y = randomBetween(12, 15);
					sphere.position.z = randomBetween(-20, 20);

					sphere.physicsImpostor = new BABYLON.PhysicsImpostor(
						sphere,
						BABYLON.PhysicsImpostor.SphereImpostor,
						{ mass: 1, restitution: 0.2 },
						this.scene,
					);
				}, randomBetween(0.2, 1) * 1000);
			}
		});

		this.scene.registerBeforeRender(() => {
			this.scene.meshes.forEach(function (mesh) {
				if (mesh.name == 'sphere' && mesh.position.y < -100) {
					mesh.dispose();
				}
			});
		});
	}

	public run() {
		this.engine.runRenderLoop(() => {
			this.scene.render();
		});

		window.addEventListener('resize', () => {
			this.engine.resize();
		});
	}
}

export default function run() {
	const canvas = document.getElementById('canvas') as HTMLCanvasElement;

	const app = new App(canvas);
	app.run();
}

function randomBetween(min: number, max: number): number {
	return Math.random() * (max - min) + min;
}
