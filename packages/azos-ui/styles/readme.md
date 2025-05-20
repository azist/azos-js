# Common Styling System
##### *General Styles that are meant to be used everywhere*


> These styles are to be used across multiple applets, things like general typography, inline grid system

This is **not** the place for individual Parts/Widget/Controls or specific controls. If you want to make a custom style for something, do it elsewhere.


## Why you should use these styles
**Consistency** in your applets. Every `.card` element will have the same base look and feel, all `.row` will perform similarly at the same breakpoints, etc.


## How to use
Import whichever CSS classes you need for your components.
```
import { STL_CARD, STL_INLINE_GRID , STL_PROSE } from 'azos-ui/styles';
```


### Card
```
<div class-"card">
    <div class="card-title">I have specific styles</div>
    <div class="card-id">I have specific styles</div>
</div>
```

### Inline Grid
```
<div class-"row cols3">
    <div>I am 1 col</div>
    <div class="span2">I am 2 cols</div>
</div>
```

### Prose
```
<div class-"prose">
    <h2>Heading</h2>
    <p>Lorem Ipsum</p>
    <p class="tip">I am a tip</p>
    <p class="example">I am an example</p>
</div>
```

