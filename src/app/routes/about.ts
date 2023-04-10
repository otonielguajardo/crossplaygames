import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-about-page',
	standalone: true,
	imports: [
		RouterLink
	],
	template: `
		<div class="container mt-5">	
			<h3>Made with <a href="https://github.com/analogjs/analog" target="_blank"><img width="25px" src="/analog.svg" alt="analogjs" class="mb-1 me-1"><span>Analog</span></a>, the Angular meta-framework.</h3>
			<a routerLink="/" class="text-decoration-none">
				<span class="me-2">👈</span>Go back
			</a>
		</div>
  `,
})
export default class AboutPageComponent { }

