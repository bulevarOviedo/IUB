//File: scene 3D
//Author: Minerva Centeno Peña
//Last modification date: 26/06/2018
//Description: this code is based in ArcGIS API for JavaScript. It contains all the classes/widgets used 
//to make the scene.

require([ //Add all the classes that the scene will need.
    "esri/views/SceneView",
    "esri/WebScene",
    "esri/webscene/Slide",
    "esri/widgets/Expand",
    "esri/widgets/LayerList",
    "esri/widgets/BasemapGallery",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/on",
    "dojo/query",
    "dojo/dom",
    "dojo/domReady!"
    
    
], function ( //Add all the items the scene will have.
    SceneView, WebScene, Slide, Expand, LayerList, BasemapGallery, domConstruct, domClass, on, query,dom
     
     // Create a new WebScene referencing a WebScene ID from ArcGIS Online.
) {
    var scene = new WebScene({
        portalItem: { // autocasts as new PortalItem()
            id: "4f0ceee8812946378ae1de8491520595"
        }
    });

    // Reference the WebScene in a SceneView instance.
    var view = new SceneView({
        map: scene,
        container: "viewDiv",
        popup: {
          dockEnabled: true,
          dockOptions: {
            buttonEnabled: false,
            breakpoint: false
          }
        }

    });

    // Create var LayerList
    var layerList = new LayerList({
        container: document.createElement("div"),
        view: view
    });
    // Create a Expand for the LayerList widget.
    var layerListExpand = new Expand({
        expandIconClass: "esri-icon-layer-list",
        view: view,
        content: layerList.domNode
    });
    
    // Create var basemapGallery.
    var basemapGallery = new BasemapGallery({
        container: document.createElement("div"),
        view: view
    });
    // Create a Expand for the basemapGallery widget.
    var baseMapExpand = new Expand({
        expandIconClass: "esri-icon-basemap", 
        view: view,
        content: basemapGallery.domNode
    });
    //Create a Expand for the Slides widget.
    var slidesExpand = new Expand({
        expandIconClass: "esri-icon-collection",
       
        view: view,
        content: slidesDiv
    });
    // Add widget to the top/bottom right/left corner of the view
    view.ui.add(layerListExpand, "top-left");
    view.ui.add(baseMapExpand, "top-left");
    view.ui.add(slidesExpand, "bottom-left");
    
   
    //Not allowed the slide to be expanded all the time
    slidesExpand.expanded = false;

      
    //Function to create the UI for a slide by creating DOM nodes and adding them to the slidesDiv container.   
    function createSlideUI(slide, placement) {
       
    //Create a new <div> element which contains all the slide information.
    //Store a reference to the created DOM node so we can use it to place other DOM nodes and connect events.
         
    var slideElement = domConstruct.create("div", {
    // Assign the ID of the slide to the <span> element
    id: slide.id,
        className: "slide"
        });

        
    //Place the newly created DOM node 
    var position = placement ? placement : "last";
    domConstruct.place(slideElement, "slidesDiv", position);

       
    //Create a <div> element to contain the slide title text    
    domConstruct.create("div", {
        
    // Place the title of the slide in the <div> element
            textContent: slide.title.text,
            className: "title"
        }, slideElement);

        
    //Create a new <img> element and place it inside the newly created slide element. 
    //This will reference the thumbnail from the slide.
         
    domConstruct.create("img", {
        // Set the src URL of the image to the thumbnail URL of the slide
        src: slide.thumbnail.url,

        // Set the title property of the image to the title of the slide
          title: slide.title.text
        }, slideElement); // Place the image inside the new <div> element

        
        //Set up a click event handler on the newly created slide. When clicked, the code 
        //defined below will execute.
        on(slideElement, "click", function() {
          
        //Remove the "active" class from all elements with the .slide class  
          query(".slide").forEach(function(node) {
            domClass.remove(node, "active");
          });

         
        //Add the "active" class on the current element being selected
          domClass.add(slideElement, "active");
        //This method allows the user to animate to the given slide's viewpoint and turn 
        //on its visible layers and basemap layers in the view.
          slide.applyTo(view);
        });
      } 
    
    view.when(function () {
        //The slides will be placed in the 'slidesDiv' <div> element.
        dom.byId("slidesDiv").style.visibility = "visible";
        //The slides are a collection inside the presentation property of the WebScene.
        var slides = scene.presentation.slides;
        //Loop through each slide in the collection and render the slide
        slides.forEach(createSlideUI);      
       
        
    });
});