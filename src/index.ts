import { ParticleAnimation } from './core/particle-animation';
import { getTheme, getThemeColors, initThemeToggle } from './theme/theme';

const initialTheme = getTheme();
const initialColors = getThemeColors(initialTheme);

const animation = new ParticleAnimation({
	canvasId: 'particle-animation__canvas',
	particleColor: initialColors.particleColor,
	connectionColor: initialColors.connectionColor,
});

animation.start();

initThemeToggle((theme) => {
	const colors = getThemeColors(theme);
	animation.setThemeColors(colors.particleColor, colors.connectionColor);
});