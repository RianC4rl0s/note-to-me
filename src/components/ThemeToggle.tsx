import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import { useTheme } from '../theme/ThemeContext'
import { COLOR_SCHEMES } from '../theme/themeConfig'

export function ThemeToggle() {
  const { mode, colorScheme, toggleMode, setColorScheme } = useTheme()

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleMode}
        className="flex h-7 w-7 items-center justify-center rounded text-text-secondary hover:bg-bg-spotlight"
        title={mode === 'light' ? 'Modo escuro' : 'Modo claro'}
      >
        {mode === 'light' ? <MoonOutlined /> : <SunOutlined />}
      </button>
      {COLOR_SCHEMES.map((s) => (
        <button
          key={s.value}
          onClick={() => setColorScheme(s.value)}
          className={`h-4 w-4 rounded-full border-2 transition-transform ${
            colorScheme === s.value
              ? 'scale-125 border-text-primary'
              : 'border-transparent hover:scale-110'
          }`}
          style={{ backgroundColor: s.color }}
          title={s.label}
        />
      ))}
    </div>
  )
}
