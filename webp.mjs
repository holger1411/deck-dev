import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';

(async () => {
	await imagemin(['src/img/*.{jpg,png}'], {
		destination: 'src/img/webp',
		plugins: [
			imageminWebp({quality: 80})
		]
	});

	console.log('Images optimized');
})();
