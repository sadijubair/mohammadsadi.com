declare module "pace-js"

interface PaceController {
  restart: () => void
}

interface Window {
  Pace?: PaceController
}
