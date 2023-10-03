<template>
  <zmp-page bg-color="white">
    <zmp-box m="4">
      <zmp-title>Settings</zmp-title>
      <zmp-list>
        <zmp-list-item title="Show notifications">
          <zmp-toggle />
        </zmp-list-item>
        <zmp-list-item title="Auto update">
          <zmp-preloader />
        </zmp-list-item>
        <zmp-list-item title="Volume">
          <zmp-range style="width: 50%" />
        </zmp-list-item>
      </zmp-list>
    </zmp-box>
  </zmp-page>
</template>
