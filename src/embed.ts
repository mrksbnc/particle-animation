import { ParticleAnimation } from './core/particle-animation';
import { Theme, getThemeColors, setTheme } from './theme/theme';

const params = new URLSearchParams(window.location.search);
const themeParam = params.get('theme');

const theme = themeParam === Theme.Light || themeParam === Theme.Dark ? themeParam : Theme.Dark;

setTheme(theme);

const colors = getThemeColors(theme);

const animation = new ParticleAnimation({
	canvasId: 'particle-animation__canvas',
	particleColor: colors.particleColor,
	connectionColor: colors.connectionColor,
});

animation.start();