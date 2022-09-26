import { mount } from "@vue/test-utils";
import FloorCounter from "../components/FloorCounter.vue";
import { test, expect } from "vitest";

test("floor is passed correctly", async () => {
    expect(FloorCounter).toBeTruthy();

    const wrapper = mount(FloorCounter, {
        props: {
            floors: 5,
            fromBuildingTable: true
        }
    });

    expect(wrapper.text()).toBe('5');
});

test("button click", async () => {
    expect(FloorCounter).toBeTruthy();

    const wrapper = mount(FloorCounter, {
        props: {
            floors: 5,
            fromBuildingTable: true
        }
    });

    expect(wrapper.text()).toBe('5');

    await wrapper.find('#decreaseButton').trigger("click");

    expect(wrapper.text()).toBe('4');
    expect(wrapper.emitted('onFloorUpdated')).toBeTruthy();
});

test("not going below 1", async () => {
    expect(FloorCounter).toBeTruthy();

    const wrapper = mount(FloorCounter, {
        props: {
            floors: 1,
            fromBuildingTable: true
        }
    });

    expect(wrapper.text()).toBe('1');

    await wrapper.find('#decreaseButton').trigger("click");

    expect(wrapper.text()).toBe('1');
});

test("not going over 163 when creating a new building", async () => {
    expect(FloorCounter).toBeTruthy();

    const wrapper = mount(FloorCounter, {
        props: {
            floors: 163,
            fromBuildingTable: true
        }
    });

    expect(wrapper.text()).toBe('163');

    await wrapper.find('#increaseButton').trigger("click");

    expect(wrapper.text()).toBe('163');
});

test("not going over the building maxFloor on the heatmap", async () => {
    expect(FloorCounter).toBeTruthy();

    const wrapper = mount(FloorCounter, {
        props: {
            floors: 1,
            fromBuildingTable: false
        }
    });

    expect(wrapper.text()).toBe('1');

    await wrapper.find('#increaseButton').trigger("click");

    expect(wrapper.text()).toBe('1');
});