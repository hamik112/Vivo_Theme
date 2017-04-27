function update_price(prdct_container,slide_pos)
{
  var slide_p = "";
  if(slide_pos == "current")
  {
    slide_p = ".slick-current ";
  }
  var strike_price = $(slide_p+'.'+prdct_container+'_product_options option:selected').data('strike');
  var selected_price = parseFloat($(slide_p+'.'+prdct_container+'_product_options option:selected').data('price'))/100;

  if(strike_price != "")
  {
    $(slide_p+"."+prdct_container+"_product_price .strike").text("£"+parseFloat(strike_price)/100);
  }
  else
  {
    $(slide_p+"."+prdct_container+"_product_price .strike").text("");
  }
  $(slide_p+"."+prdct_container+"_product_price .price-box__new").text("£"+selected_price);
}

function load_content(P_URL, position)
{
  /* working, but abandoned 
  $.ajax({
    url: P_URL,
    type: 'GET',
    dataType:	"json",
    success: function(result){
      var options_str = "";

      $.each(result.variants, function (i) {
        options_str+='<option data-sku="'+result.variants[i].sku+'" value="'+result.variants[i].id+'" data-price="'+result.variants[i].price+'" data-strike="'+result.variants[i].compare_at_price+'">'+result.variants[i].title+'</option>';
      });

      $("."+position+"_container.product_description").html(result.description);
      $("."+position+"_product_options").html(options_str);
    }
  });*/
  update_price(position,"");
  update_ro_price(position,0,"");
}



$(".single-option-selector").change(function(){
  var this_container = $(this).data('type');
  var sel_index = $('option:selected',this).index();

/*  $('#'+this_container+'_raw #productSelect').prop('selectedIndex', sel_index).trigger('change');*/
  update_price(this_container,"current");
  
  update_ro_price(this_container,sel_index,"current");
});

function update_ro_price(prdct_container,indx,slide_pos)
{
  var ro_price = $('.'+prdct_container+'_raw .ro_price_'+indx).html();
  $('.'+prdct_container+'_form .discounted_price').val(ro_price);
  var ro_unformatted_price = $('.'+prdct_container+'_raw .ro_unformatted_price_'+indx).html();
  $('.'+prdct_container+'_form .ro_unformatted_price').val(ro_unformatted_price);

  var ro_discount_percentage = $('.'+prdct_container+'_form .ro_discount_percentage').val();
  $('.'+prdct_container+'_form .ro_disc_per').html(ro_discount_percentage);
  $('.'+prdct_container+'_form .ro_disc_prc').html(ro_price);
}

/*----------Slick Slider code starts for step - 3 and 4---------------*/
$(document).on('ready', function() {
  
  
  //match height of section
  $('.thrive_box').matchHeight();
  
  $(".vivo_slider").slick({
    dots: false,
    infinite: true,
    centerMode: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          dots: false,
          infinite: true,
          centerMode: true,
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  });
  
  var $carousel = $('.vivo_slider');	//  to enable arrow keys on slider
  
  // vivo video-slider
  $(".vivo_video_slider1").slick({
    dots: false,
    infinite: true,
    centerMode: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  });
  var $carousel = $('.vivo_video_slider1');	//  to enable arrow keys on slider

  $(document).on('keydown', function(e) {
    if(e.keyCode == 37) {
      $carousel.slick('slickPrev');
    }
    if(e.keyCode == 39) {
      $carousel.slick('slickNext');
    }
  });
  
  
  
});
/*----------Slick Slider code ends---------------*/
$('.addtobasket').click(function(e) {
  e.preventDefault();
  var this_container = $(this).data('text');

  var sel_radio = parseInt($('.slick-current .'+this_container+'_form input[name=recurring_radio_btn]:checked').val());

  sel_radio = isNaN(sel_radio) ? 0 : sel_radio;

  if(sel_radio == 0)
  {
    var var_id = $(".slick-current").find('.single-option-selector option:selected').val();
    var qtty_val = $(this).parents('form').find('.qty-input').val();

    if(var_id !="")
    {
      CartJS.removeItemById(var_id); // remove if previously added

      CartJS.addItem(var_id, qtty_val, {}, {

        // Define a success callback to display a success message.
        "success": function(data, textStatus, jqXHR) {
          /*Original success code here*/
          ///////////////////////////////////////////////////
          jQuery.getJSON('/cart.json', function(cart) {
            $(".menu_cart_total").text( cart.item_count );	// new total items
          });
          var disc_p = (parseInt(data.discounted_price)/100);
          $("#cart-box .product-link" ).attr("href", data.url);	// url
          $("#cart-box .product-img" ).attr("src", data.image); // image
          $("#cart-box .product-title a" ).text(data.product_title); // title
          $("#cart-box .product-price .money" ).text("£"+disc_p); // price
          $("#cart-box" ).slideDown(500); // showbox
          $("#cart-box").delay(8000).slideUp(500);
          ///////////////////////////////////////////////////
          window.location.href = "https://www.vivolife.co.uk/pages/step-4";
          
        },

        // Define an error callback to display an error message.
        "error": function(data, jqXHR, textStatus, errorThrown) {
          console.log(data.responseText);
          var responseObj = jQuery.parseJSON(data.responseText);

          jQuery.getJSON('/cart.json', function(cart) {
            console.log(cart);
            $(".menu_cart_total").text( cart.item_count );	// new total items
          });

          $("#cart-error-box .heading" ).text(responseObj.message);
          $("#cart-error-box .message" ).text(responseObj.description);
          $("#cart-error-box" ).slideDown(500); // showbox
          $("#cart-error-box").delay(8000).slideUp(500);
        }
      });

    }
  }
  else
  {
    $.ajax({
      url: "https://www.vivolife.co.uk/cart/add",
      data: $('#add-item-form-'+this_container).serialize(),
      type: 'GET',
      success: function(result){
          ///////////////////////////////////////////////////
          jQuery.getJSON('/cart.json', function(cart) {
            //alert("total = "+cart.item_count);
            $(".menu_cart_total").text( cart.item_count );	// new total items
          });
          var disc_p = $('#add-item-form-'+this_container+' .discounted_price').val();
          var prd_img = $('.'+this_container+'_raw .prdct_featured_image').html();
          var prd_link = $('.'+this_container+'_raw .prdct_link').html();
          var prd_ttl = $('.'+this_container+'_raw .prdct_ttl').html();
        
          $("#cart-box .product-link" ).attr("href", prd_link);	// url
          $("#cart-box .product-img" ).attr("src", "//cdn.shopify.com/s/files/1/1374/7199/"+prd_img); // image
          $("#cart-box .product-title a" ).text(prd_ttl); // title
          $("#cart-box .product-price .money" ).text(disc_p); // price
          $("#cart-box" ).slideDown(500); // showbox
          $("#cart-box").delay(8000).slideUp(500);
          // code for "Final step"/checkout button on steps page starts
          jQuery('.shopping-cart-table').html("<script>mixed_cart = true;</script>");
        
           window.location.href = "https://www.vivolife.co.uk/pages/step-4";
          // code for "Final step"/checkout button on steps page ends

      },
      // Define an error callback to display an error message.
      "error": function(data, jqXHR, textStatus, errorThrown) {
        jQuery.getJSON('/cart.json', function(cart) {
          console.log(cart);
          $(".menu_cart_total").text( cart.item_count );	// new total items
        });

        $("#cart-error-box .heading" ).text("Error:");
        $("#cart-error-box .message" ).text("Something went wrong, Please try again.");
        $("#cart-error-box" ).slideDown(500); // showbox
        $("#cart-error-box").delay(8000).slideUp(500);
      }
    });
    /*$(this).parents('form').find('.variant_id').remove();*/
  }
});


$('.add_after_step4').click(function(e){
  e.preventDefault();
  var this_container = $(this).data('form');
  
  $.ajax({
    url: "https://www.vivolife.co.uk/cart/add",
    data: $('#add-item-form-'+this_container).serialize(),
    type: 'GET',
    success: function(result){
      window.location.href = "https://www.vivolife.co.uk/pages/step-4";
    },
    // Define an error callback to display an error message.
    "error": function(data, jqXHR, textStatus, errorThrown) {
      jQuery.getJSON('/cart.json', function(cart) {
        console.log(cart);
        $(".menu_cart_total").text( cart.item_count );	// new total items
      });

      $("#cart-error-box .heading" ).text("Error:");
      $("#cart-error-box .message" ).text("Something went wrong, Please try again.");
      $("#cart-error-box" ).slideDown(500); // showbox
      $("#cart-error-box").delay(8000).slideUp(500);
    }
  });
});


function go_Back() {
  window.history.back();
}