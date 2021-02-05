import Template from './template'

if (window.location.hash === '#visualizer') {
    const template = new Template()
} else {
    window.location.href = `${PROJECT_ROOT}/login`
}
