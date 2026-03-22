export enum Theme {
	Dark = 'dark',
	Light = 'light',
}

const STORAGE_KEY: string = 'particle-animation-theme' as const;

const THEME_CONFIG = {
	[Theme.Light]: { particleColor: 'oklch(20.8% 0.042 265.755)', connectionColor: '30,30,60' },
	[Theme.Dark]: { particleColor: '#FFFFFF', connectionColor: '255,255,255' },
} as const;

export function getTheme(): Theme {
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === Theme.Dark || stored === Theme.Light) {
		return stored;
	}
	return window.matchMedia('(prefers-color-scheme: light)').matches ? Theme.Light : Theme.Dark;
}

export function setTheme(theme: Theme): void {
	localStorage.setItem(STORAGE_KEY, theme);
	document.documentElement.setAttribute('data-theme', theme);
}

export function getThemeColors(theme: Theme) {
	return THEME_CONFIG[theme];
}

export function initThemeToggle(onToggle: (theme: Theme) => void): void {
	const btn = document.getElementById('theme-toggle') as HTMLButtonElement;

	let current = getTheme();
	setTheme(current);

	btn.addEventListener('click', () => {
		current = current === Theme.Dark ? Theme.Light : Theme.Dark;

		setTheme(current);

		btn.setAttribute(
			'aria-label',
			`Switch to ${current === Theme.Dark ? Theme.Light : Theme.Dark} mode`,
		);
		onToggle(current);
	});
}