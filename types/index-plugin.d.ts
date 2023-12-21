/**
 * Wires up FileUtil functions on the plugin eventbus.
 *
 * @param {object} ev - PluginInvokeEvent - The plugin event.
 *
 * @see https://www.npmjs.com/package/@typhonjs-plugin/manager
 */
declare function onPluginLoad(ev: object): void;

export { onPluginLoad };
