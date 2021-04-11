export interface HomePageState {
    kind: 'home'
}

export const zeroHomePageState = (): HomePageState => ({ kind: 'home' })